// Fires concurrent reservations at the real limiter against a throwaway local
// D1 (Miniflare). No network, no Stability calls.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { importServerModule, startD1 } from './d1-harness.mjs'

let d1, db, limiter

before(async () => {
  limiter = await importServerModule('lib/server/ai-rate-limit.ts')
  d1 = await startD1()
  db = d1.db
})

after(() => d1?.stop())

const fire = (n, userFor) =>
  Promise.all(Array.from({ length: n }, (_, i) => limiter.reserveInDb(db, userFor(i), Date.now())))

test('per-user free limit holds under 25 concurrent requests', async () => {
  const results = await fire(25, () => 'user_free')
  const allowed = results.filter((r) => r.allowed)
  assert.equal(allowed.length, limiter.AI_LIMITS.freePerDay)
  assert.ok(results.filter((r) => !r.allowed).every((r) => r.code === 'FREE_LIMIT'))
})

test('global free limit holds under concurrent distinct users', async () => {
  await db.prepare('DELETE FROM ai_generations').run()
  const n = limiter.AI_LIMITS.freeGlobalPerDay + 40
  const results = await fire(n, (i) => `user_g${i}`)
  assert.equal(results.filter((r) => r.allowed).length, limiter.AI_LIMITS.freeGlobalPerDay)
  assert.ok(results.filter((r) => !r.allowed).every((r) => r.code === 'GLOBAL_LIMIT'))
})

test('Pro monthly limit holds under 20 concurrent requests', async () => {
  await db.prepare('DELETE FROM ai_generations').run()
  const now = Date.now()
  const user = 'user_pro'
  await db
    .prepare("INSERT INTO subscriptions (user_id, plan, status, current_period_end, updated_at) VALUES (?, 'pro_monthly', 'active', ?, ?)")
    .bind(user, now + 20 * 86400e3, now)
    .run()
  const already = limiter.AI_LIMITS.proPerMonth - 3
  await db
    .prepare(
      `WITH RECURSIVE seq(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM seq WHERE i < ?)
       INSERT INTO ai_generations (user_id, created_at, source) SELECT ?, ? - i * 1000, 'pro' FROM seq`
    )
    .bind(already, user, now - 2 * 86400e3)
    .run()
  // Use up today's free allowance first so every request below goes to Pro.
  for (let i = 0; i < limiter.AI_LIMITS.freePerDay; i++) assert.equal((await limiter.reserveInDb(db, user, Date.now())).source, 'free')

  const results = await fire(20, () => user)
  const allowed = results.filter((r) => r.allowed)
  assert.equal(allowed.length, 3)
  assert.ok(allowed.every((r) => r.source === 'pro'))
  assert.ok(results.filter((r) => !r.allowed).every((r) => r.code === 'PRO_LIMIT'))
})

test('credits fall back once Pro is used up and are refunded when the paid ceiling is hit', async () => {
  const user = 'user_pro'
  await db.prepare('INSERT INTO user_credits (user_id, balance, updated_at) VALUES (?, 2, ?)').bind(user, Date.now()).run()
  const results = await fire(5, () => user)
  assert.equal(results.filter((r) => r.allowed && r.source === 'credit').length, 2)
  const balance = await db.prepare('SELECT balance FROM user_credits WHERE user_id = ?').bind(user).first()
  assert.equal(balance.balance, 0)

  // Fill the site-wide paid ceiling, then a credit must be refunded, not spent.
  const now = Date.now()
  await db
    .prepare(
      `WITH RECURSIVE seq(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM seq WHERE i < ?)
       INSERT INTO ai_generations (user_id, created_at, source) SELECT 'filler', ? - i, 'credit' FROM seq`
    )
    .bind(limiter.AI_LIMITS.paidGlobalPerDay, now)
    .run()
  await db.prepare('UPDATE user_credits SET balance = 1 WHERE user_id = ?').bind(user).run()
  const denied = await limiter.reserveInDb(db, user, Date.now())
  assert.equal(denied.allowed, false)
  assert.equal(denied.code, 'PAID_GLOBAL_LIMIT')
  const after = await db.prepare('SELECT balance FROM user_credits WHERE user_id = ?').bind(user).first()
  assert.equal(after.balance, 1)
})

test('release() frees the slot again', async () => {
  await db.prepare('DELETE FROM ai_generations').run()
  const user = 'user_release'
  const first = await fire(limiter.AI_LIMITS.freePerDay, () => user)
  assert.ok(first.every((r) => r.allowed))
  assert.equal((await limiter.reserveInDb(db, user, Date.now())).allowed, false)
  await first[0].release()
  assert.equal((await limiter.reserveInDb(db, user, Date.now())).allowed, true)
})
