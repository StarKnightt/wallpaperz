import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb, type D1Like } from '@/lib/server/d1'
import { addCreditsStmt, consumeCredit, getCredits, getSubscription, subscriptionGrantsPro, type SubscriptionRow } from '@/lib/server/entitlements'
import { FREE_PER_DAY, PRO_PER_MONTH, type Entitlements, type LimitCode } from '@/lib/pricing'

export const AI_LIMITS = {
  freePerDay: FREE_PER_DAY,
  proPerMonth: PRO_PER_MONTH,
  /** Site-wide ceiling on free generations so throwaway accounts can't drain Stability credits. */
  freeGlobalPerDay: 150,
  /** Separate safety ceiling for paid generations (Pro + credits) to cap Stability spend. */
  paidGlobalPerDay: 2000,
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const PRO_WINDOW = 30 * DAY
/** Privacy policy: generation logs are kept 90 days. Longer than every window read above. */
const LOG_RETENTION = 90 * DAY
const RETENTION_SWEEP_RATE = 0.01

// Opportunistic retention sweep (no cron on the free plan): an indexed delete on
// ~1% of reservations, run after the response via waitUntil. Only touches
// ai_generations; credits, subscriptions and payment records are untouched.
async function maybePruneGenerationLogs(db: D1Like, now: number) {
  if (Math.random() >= RETENTION_SWEEP_RATE) return
  const sweep = db
    .prepare('DELETE FROM ai_generations WHERE created_at < ?')
    .bind(now - LOG_RETENTION)
    .run()
    .catch(() => {})
  try {
    const { ctx } = await getCloudflareContext({ async: true })
    ctx.waitUntil(sweep)
  } catch {
    await sweep
  }
}

export type GenerationSource = 'free' | 'pro' | 'credit'

export type LimitResult =
  | { allowed: true; source: GenerationSource; entitlements: Entitlements; release: () => Promise<void> }
  | { allowed: false; code: LimitCode; message: string; resetTime: number | null; entitlements: Entitlements }

interface Usage {
  freeUsed: number
  freeOldest: number | null
  proUsed: number
  proOldest: number | null
  credits: number
  sub: SubscriptionRow | null
}

function summarize(u: Usage, now: number): Entitlements {
  const pro = subscriptionGrantsPro(u.sub, now)
  return {
    plan: pro ? (u.sub!.plan === 'lifetime' ? 'lifetime' : 'pro') : 'free',
    free: {
      used: u.freeUsed,
      limit: AI_LIMITS.freePerDay,
      remaining: Math.max(0, AI_LIMITS.freePerDay - u.freeUsed),
      resetAt: u.freeOldest != null ? u.freeOldest + DAY : null,
    },
    pro: pro
      ? {
          used: u.proUsed,
          limit: AI_LIMITS.proPerMonth,
          remaining: Math.max(0, AI_LIMITS.proPerMonth - u.proUsed),
          resetAt: u.proOldest != null ? u.proOldest + PRO_WINDOW : null,
          periodEnd: u.sub!.current_period_end,
          status: u.sub!.status,
        }
      : null,
    credits: u.credits,
  }
}

async function countSince(db: D1Like, sql: string, ...binds: unknown[]) {
  const row = await db.prepare(sql).bind(...binds).first<{ n: number; oldest: number | null }>()
  return { n: row?.n ?? 0, oldest: row?.oldest ?? null }
}

async function loadUsage(db: D1Like, userId: string, now: number): Promise<Usage> {
  const userSql = 'SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM ai_generations WHERE user_id = ? AND source = ? AND created_at > ?'
  const [free, pro, credits, sub] = await Promise.all([
    countSince(db, userSql, userId, 'free', now - DAY),
    countSince(db, userSql, userId, 'pro', now - PRO_WINDOW),
    getCredits(db, userId),
    getSubscription(db, userId),
  ])
  return { freeUsed: free.n, freeOldest: free.oldest, proUsed: pro.n, proOldest: pro.oldest, credits, sub }
}

// Dev fallback only (`next dev` has no D1 binding): free tier, per-isolate, not durable.
const memory = new Map<string, number[]>()

function memoryUsage(userId: string, now: number): Usage {
  const times = (memory.get(userId) ?? []).filter((t) => t > now - DAY)
  memory.set(userId, times)
  return { freeUsed: times.length, freeOldest: times[0] ?? null, proUsed: 0, proOldest: null, credits: 0, sub: null }
}

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const now = Date.now()
  const db = await getDb()
  return summarize(db ? await loadUsage(db, userId, now) : memoryUsage(userId, now), now)
}

/**
 * Reserves one generation, spending the free daily allowance first, then the
 * Pro monthly allowance, then a credit. Call `release()` when the upstream
 * generation fails; it refunds whatever was consumed.
 */
export async function reserveGeneration(userId: string): Promise<LimitResult> {
  const now = Date.now()
  const db = await getDb()

  if (!db) {
    const usage = memoryUsage(userId, now)
    if (usage.freeUsed >= AI_LIMITS.freePerDay) return deny('FREE_LIMIT', usage, now)
    memory.get(userId)!.push(now)
    usage.freeUsed++
    usage.freeOldest ??= now
    return {
      allowed: true,
      source: 'free',
      entitlements: summarize(usage, now),
      release: async () => { memory.set(userId, (memory.get(userId) ?? []).filter((t) => t !== now)) },
    }
  }

  await maybePruneGenerationLogs(db, now)
  return reserveInDb(db, userId, now)
}

const USER_SOURCE_SINCE = 'SELECT COUNT(*) AS n FROM ai_generations WHERE user_id = ? AND source = ? AND created_at > ?'
const FREE_GLOBAL_SINCE = "SELECT COUNT(*) AS n FROM ai_generations WHERE source = 'free' AND created_at > ?"
const PAID_GLOBAL_SINCE = "SELECT COUNT(*) AS n FROM ai_generations WHERE source IN ('pro', 'credit') AND created_at > ?"

/**
 * D1 path of reserveGeneration. Every allowance is claimed with one
 * conditional INSERT ... SELECT ... WHERE (count) < limit, so concurrent
 * requests can't both pass a check made before either one inserted.
 */
export async function reserveInDb(db: D1Like, userId: string, now: number): Promise<LimitResult> {
  const usage = await loadUsage(db, userId, now)
  const isPro = subscriptionGrantsPro(usage.sub, now)
  let freeGlobalHit = false
  let paidGlobalHit = false

  /** Inserts the usage row only while every [countSql, binds, limit] is under its limit. */
  const insertIf = async (source: GenerationSource, limits: Array<[string, unknown[], number]>) => {
    const where = limits.map(([sql]) => `(${sql}) < ?`).join(' AND ')
    const res = await db
      .prepare(`INSERT INTO ai_generations (user_id, created_at, source) SELECT ?, ?, ? WHERE ${where}`)
      .bind(userId, now, source, ...limits.flatMap(([, binds, limit]) => [...binds, limit]))
      .run()
    return res.meta?.changes === 1 ? { rowId: res.meta.last_row_id } : null
  }
  const count = async (sql: string, ...binds: unknown[]) =>
    (await countSince(db, sql, ...binds)).n
  const deleteRow = (rowId: number | undefined) =>
    rowId != null ? db.prepare('DELETE FROM ai_generations WHERE id = ?').bind(rowId) : null
  const paidGlobalLimit: [string, unknown[], number] = [PAID_GLOBAL_SINCE, [now - DAY], AI_LIMITS.paidGlobalPerDay]

  if (usage.freeUsed < AI_LIMITS.freePerDay) {
    const claimed = await insertIf('free', [
      [USER_SOURCE_SINCE, [userId, 'free', now - DAY], AI_LIMITS.freePerDay],
      [FREE_GLOBAL_SINCE, [now - DAY], AI_LIMITS.freeGlobalPerDay],
    ])
    if (claimed) {
      usage.freeUsed++
      usage.freeOldest ??= now
      return {
        allowed: true,
        source: 'free',
        entitlements: summarize(usage, now),
        release: async () => { await deleteRow(claimed.rowId)?.run() },
      }
    }
    usage.freeUsed = await count(USER_SOURCE_SINCE, userId, 'free', now - DAY)
    freeGlobalHit = usage.freeUsed < AI_LIMITS.freePerDay
  }

  if (isPro && usage.proUsed < AI_LIMITS.proPerMonth) {
    const claimed = await insertIf('pro', [
      [USER_SOURCE_SINCE, [userId, 'pro', now - PRO_WINDOW], AI_LIMITS.proPerMonth],
      paidGlobalLimit,
    ])
    if (claimed) {
      usage.proUsed++
      usage.proOldest ??= now
      return {
        allowed: true,
        source: 'pro',
        entitlements: summarize(usage, now),
        release: async () => { await deleteRow(claimed.rowId)?.run() },
      }
    }
    paidGlobalHit = (await count(PAID_GLOBAL_SINCE, now - DAY)) >= AI_LIMITS.paidGlobalPerDay
    if (!paidGlobalHit) usage.proUsed = await count(USER_SOURCE_SINCE, userId, 'pro', now - PRO_WINDOW)
  }

  if (!paidGlobalHit && usage.credits > 0 && (await consumeCredit(db, userId, now))) {
    const claimed = await insertIf('credit', [paidGlobalLimit])
    if (claimed) {
      usage.credits--
      return {
        allowed: true,
        source: 'credit',
        entitlements: summarize(usage, now),
        release: async () => {
          const del = deleteRow(claimed.rowId)
          await db.batch([...(del ? [del] : []), addCreditsStmt(db, userId, 1)])
        },
      }
    }
    await addCreditsStmt(db, userId, 1, now).run()
    paidGlobalHit = true
  }

  if (paidGlobalHit) return deny('PAID_GLOBAL_LIMIT', usage, now)
  if (isPro) return deny('PRO_LIMIT', usage, now)
  if (freeGlobalHit) return deny('GLOBAL_LIMIT', usage, now)
  return deny('FREE_LIMIT', usage, now)
}

function deny(code: LimitCode, usage: Usage, now: number): LimitResult {
  const entitlements = summarize(usage, now)
  const messages: Record<LimitCode, { message: string; resetTime: number | null }> = {
    FREE_LIMIT: {
      message: `You've used your ${AI_LIMITS.freePerDay} free generations for today. Grab a credit pack or go Pro to keep creating.`,
      resetTime: entitlements.free.resetAt,
    },
    GLOBAL_LIMIT: {
      message: 'Free generations are paused for today after a busy day. Credits and Pro keep working.',
      resetTime: now + DAY,
    },
    PRO_LIMIT: {
      message: `You've used all ${AI_LIMITS.proPerMonth} Pro generations for this month. Credit packs top you up instantly.`,
      resetTime: entitlements.pro?.resetAt ?? null,
    },
    PAID_GLOBAL_LIMIT: {
      message: 'The generator is at capacity right now. Nothing was charged. Please try again in an hour.',
      resetTime: now + HOUR,
    },
  }
  return { allowed: false, code, entitlements, ...messages[code] }
}
