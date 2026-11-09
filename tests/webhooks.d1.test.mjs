import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { importServerModule, startD1 } from './d1-harness.mjs'

const PRODUCT = 'pdt_test_pro_monthly'
let d1, db, dodo, events

before(async () => {
  delete process.env.CLERK_SECRET_KEY
  delete process.env.DODO_PAYMENTS_API_KEY
  process.env.DODO_PRODUCT_PRO_MONTHLY = PRODUCT
  dodo = await importServerModule('lib/server/dodo-webhook.ts')
  events = await importServerModule('lib/server/webhook-events.ts')
  d1 = await startD1()
  db = d1.db
})

after(() => d1?.stop())

const day = 86400e3
const subEvent = (type, at, status, user = 'user_sub') => ({
  type,
  timestamp: new Date(at).toISOString(),
  data: {
    subscription_id: `sub_${user}`,
    product_id: PRODUCT,
    status,
    next_billing_date: new Date(at + 30 * day).toISOString(),
    metadata: { clerk_user_id: user },
  },
})
const row = (user = 'user_sub') => db.prepare('SELECT status, last_event_at FROM subscriptions WHERE user_id = ?').bind(user).first()

test('a delayed active event after cancellation does not restore Pro', async () => {
  const t = Date.now() - 10 * day
  await dodo.handleDodoEvent(db, subEvent('subscription.active', t, 'active'))
  assert.equal((await row()).status, 'active')

  await dodo.handleDodoEvent(db, subEvent('subscription.cancelled', t + 2 * day, 'cancelled'))
  assert.equal((await row()).status, 'cancelled')

  await dodo.handleDodoEvent(db, subEvent('subscription.active', t + day, 'active'))
  assert.equal((await row()).status, 'cancelled')
  assert.equal((await row()).last_event_at, t + 2 * day)

  // A genuinely newer event (resubscribe/renewal) still applies.
  await dodo.handleDodoEvent(db, subEvent('subscription.renewed', t + 3 * day, 'active'))
  assert.equal((await row()).status, 'active')
})

test('an older status change cannot override a newer active event', async () => {
  const t = Date.now() - 5 * day
  await dodo.handleDodoEvent(db, subEvent('subscription.active', t, 'active', 'user_b'))
  await dodo.handleDodoEvent(db, subEvent('subscription.on_hold', t - day, 'on_hold', 'user_b'))
  assert.equal((await row('user_b')).status, 'active')
})

const paymentEvent = (at, user, id) => ({
  type: 'payment.succeeded',
  timestamp: new Date(at).toISOString(),
  data: {
    payment_id: id,
    subscription_id: `sub_${user}`,
    product_cart: [{ product_id: PRODUCT, quantity: 1 }],
    total_amount: 499,
    metadata: { clerk_user_id: user },
  },
})
const periodEnd = (user) =>
  db.prepare('SELECT current_period_end FROM subscriptions WHERE user_id = ?').bind(user).first().then((r) => r.current_period_end)

test('a renewal payment stamped after subscription.renewed does not drop the new period end', async () => {
  const user = 'user_renew'
  const t = Date.now() - 31 * day
  await dodo.handleDodoEvent(db, subEvent('subscription.active', t, 'active', user))

  // Renewal: Dodo stamps the payment a minute after the renewal but delivers it first.
  const renewedAt = t + 30 * day
  await dodo.handleDodoEvent(db, paymentEvent(renewedAt + 60e3, user, 'pay_renew_1'))
  await dodo.handleDodoEvent(db, subEvent('subscription.renewed', renewedAt, 'active', user))

  assert.equal(await periodEnd(user), renewedAt + 30 * day)
  assert.equal((await row(user)).status, 'active')
  assert.equal((await row(user)).last_event_at, renewedAt)
})

test('a stale payment cannot reactivate a subscription put on hold later', async () => {
  const user = 'user_hold'
  const t = Date.now() - 5 * day
  await dodo.handleDodoEvent(db, subEvent('subscription.active', t, 'active', user))
  await dodo.handleDodoEvent(db, subEvent('subscription.on_hold', t + 2 * day, 'on_hold', user))
  await dodo.handleDodoEvent(db, paymentEvent(t + day, user, 'pay_hold_1'))
  assert.equal((await row(user)).status, 'on_hold')
})

test('rows from before migration 0004 (no last_event_at) still update', async () => {
  const now = Date.now()
  await db
    .prepare("INSERT INTO subscriptions (user_id, plan, status, current_period_end, dodo_subscription_id, updated_at) VALUES ('user_old', 'pro_monthly', 'active', ?, 'sub_user_old', ?)")
    .bind(now + day, now)
    .run()
  await dodo.handleDodoEvent(db, subEvent('subscription.cancelled', now, 'cancelled', 'user_old'))
  assert.equal((await row('user_old')).status, 'cancelled')
  await dodo.handleDodoEvent(db, subEvent('subscription.renewed', now + 1000, 'active', 'user_old'))
  assert.equal((await row('user_old')).status, 'active')
})

test('processed webhook ids are remembered and old ones pruned', async () => {
  const now = Date.now()
  assert.equal(await events.alreadyProcessed(db, 'dodo:msg_1'), false)
  await events.markProcessed(db, 'dodo:msg_1', now - 40 * day)
  assert.equal(await events.alreadyProcessed(db, 'dodo:msg_1'), true)
  await events.markProcessed(db, 'dodo:msg_1', now)
  await events.markProcessed(db, 'clerk:msg_2', now)
  assert.equal(await events.alreadyProcessed(db, 'dodo:msg_1'), false)
  assert.equal(await events.alreadyProcessed(db, 'clerk:msg_2'), true)
})
