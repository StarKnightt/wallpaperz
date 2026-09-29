import { getDb, type D1Like } from '@/lib/server/d1'
import type { PublicPlan } from '@/lib/pricing'

export type SubPlan = 'pro_monthly' | 'pro_yearly' | 'lifetime'
export type SubStatus = 'active' | 'cancelled' | 'on_hold' | 'expired' | 'failed' | 'revoked'

export interface SubscriptionRow {
  user_id: string
  plan: SubPlan
  status: SubStatus
  current_period_end: number | null
  dodo_subscription_id: string | null
  dodo_customer_id: string | null
  updated_at: number
}

// Renewal webhooks can land a little after next_billing_date.
const RENEWAL_GRACE_MS = 3 * 24 * 60 * 60 * 1000

export async function getSubscription(db: D1Like, userId: string): Promise<SubscriptionRow | null> {
  return db.prepare('SELECT * FROM subscriptions WHERE user_id = ?').bind(userId).first<SubscriptionRow>()
}

export function subscriptionGrantsPro(sub: SubscriptionRow | null, now = Date.now()): boolean {
  if (!sub) return false
  if (sub.plan === 'lifetime') return sub.status === 'active'
  if (sub.status === 'active') return sub.current_period_end == null || sub.current_period_end + RENEWAL_GRACE_MS > now
  // Cancelled subscriptions keep access for the period already paid for.
  if (sub.status === 'cancelled') return sub.current_period_end != null && sub.current_period_end > now
  return false
}

export function publicPlanFor(sub: SubscriptionRow | null, now = Date.now()): PublicPlan | null {
  if (!subscriptionGrantsPro(sub, now)) return null
  return sub!.plan === 'lifetime' ? 'lifetime' : 'pro'
}

/**
 * Pro entitlement (active subscription or lifetime). Used for the 300/month
 * allowance, ad-free, and the upcoming premium bundle downloads.
 */
export async function isPro(userId: string): Promise<boolean> {
  const db = await getDb()
  if (!db) return false
  return subscriptionGrantsPro(await getSubscription(db, userId))
}

// ---- credits ---------------------------------------------------------------

export async function getCredits(db: D1Like, userId: string): Promise<number> {
  const row = await db.prepare('SELECT balance FROM user_credits WHERE user_id = ?').bind(userId).first<{ balance: number }>()
  return row?.balance ?? 0
}

export function addCreditsStmt(db: D1Like, userId: string, amount: number, now = Date.now()) {
  return db
    .prepare(
      `INSERT INTO user_credits (user_id, balance, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET balance = balance + excluded.balance, updated_at = excluded.updated_at`
    )
    .bind(userId, amount, now)
}

/** Takes back up to `amount` credits; never below zero (spent credits aren't clawed back). */
export function removeCreditsStmt(db: D1Like, userId: string, amount: number, now = Date.now()) {
  return db
    .prepare('UPDATE user_credits SET balance = MAX(balance - ?, 0), updated_at = ? WHERE user_id = ?')
    .bind(amount, now, userId)
}

// ---- Dodo customers --------------------------------------------------------

export function upsertCustomerStmt(db: D1Like, userId: string, dodoCustomerId: string, now = Date.now()) {
  return db
    .prepare(
      `INSERT INTO customers (user_id, dodo_customer_id, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET dodo_customer_id = excluded.dodo_customer_id, updated_at = excluded.updated_at`
    )
    .bind(userId, dodoCustomerId, now)
}

/** Latest Dodo customer for the user (any purchase), falling back to the subscription row. */
export async function getDodoCustomerId(db: D1Like, userId: string): Promise<string | null> {
  const row = await db
    .prepare('SELECT dodo_customer_id FROM customers WHERE user_id = ?')
    .bind(userId)
    .first<{ dodo_customer_id: string }>()
  if (row?.dodo_customer_id) return row.dodo_customer_id
  return (await getSubscription(db, userId))?.dodo_customer_id ?? null
}

/** Atomically spends one credit; false when the balance is empty. */
export async function consumeCredit(db: D1Like, userId: string, now = Date.now()): Promise<boolean> {
  const res = await db
    .prepare('UPDATE user_credits SET balance = balance - 1, updated_at = ? WHERE user_id = ? AND balance > 0')
    .bind(now, userId)
    .run()
  return (res.meta?.changes ?? 0) > 0
}

// ---- subscriptions ---------------------------------------------------------

/**
 * Grants or renews Pro. Never overwrites an active lifetime row with a
 * subscription; lifetime grants always win. A `revoked` row (refund / lost
 * dispute) is terminal for its Dodo subscription: later events for that same
 * subscription can't bring it back.
 */
export function activatePlanStmt(
  db: D1Like,
  row: Omit<SubscriptionRow, 'updated_at' | 'status'> & { status?: SubStatus },
  now = Date.now()
) {
  const status = row.status ?? 'active'
  const guard =
    row.plan === 'lifetime'
      ? ''
      : `WHERE NOT (subscriptions.plan = 'lifetime' AND subscriptions.status = 'active')
           AND NOT (subscriptions.status = 'revoked' AND excluded.dodo_subscription_id IS NOT NULL
                    AND subscriptions.dodo_subscription_id = excluded.dodo_subscription_id)`
  return db
    .prepare(
      `INSERT INTO subscriptions (user_id, plan, status, current_period_end, dodo_subscription_id, dodo_customer_id, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         plan = excluded.plan,
         status = excluded.status,
         current_period_end = COALESCE(excluded.current_period_end, subscriptions.current_period_end),
         dodo_subscription_id = COALESCE(excluded.dodo_subscription_id, subscriptions.dodo_subscription_id),
         dodo_customer_id = COALESCE(excluded.dodo_customer_id, subscriptions.dodo_customer_id),
         updated_at = excluded.updated_at
       ${guard}`
    )
    .bind(
      row.user_id,
      row.plan,
      status,
      row.plan === 'lifetime' ? null : row.current_period_end,
      row.dodo_subscription_id,
      row.dodo_customer_id,
      now
    )
}

export async function activatePlan(db: D1Like, row: Parameters<typeof activatePlanStmt>[1], now = Date.now()) {
  await activatePlanStmt(db, row, now).run()
}

/**
 * Moves a subscription to a non-active status. Only touches the row when it
 * still belongs to that Dodo subscription, so events for an old subscription
 * can't revoke a newer one (or a lifetime grant). A revoked row stays revoked.
 */
export async function setSubscriptionStatus(
  db: D1Like,
  userId: string,
  dodoSubscriptionId: string,
  status: SubStatus,
  periodEnd: number | null,
  now = Date.now()
) {
  await db
    .prepare(
      `UPDATE subscriptions SET status = ?, current_period_end = COALESCE(?, current_period_end), updated_at = ?
       WHERE user_id = ? AND dodo_subscription_id = ? AND plan != 'lifetime' AND status != 'revoked'`
    )
    .bind(status, periodEnd, now, userId, dodoSubscriptionId)
    .run()
}

export async function revokeLifetime(db: D1Like, userId: string, now = Date.now()) {
  await db
    .prepare(`UPDATE subscriptions SET status = 'revoked', updated_at = ? WHERE user_id = ? AND plan = 'lifetime'`)
    .bind(now, userId)
    .run()
}

export async function findUserBySubscription(db: D1Like, dodoSubscriptionId: string): Promise<string | null> {
  const row = await db
    .prepare('SELECT user_id FROM subscriptions WHERE dodo_subscription_id = ?')
    .bind(dodoSubscriptionId)
    .first<{ user_id: string }>()
  return row?.user_id ?? null
}

// ---- Clerk publicMetadata --------------------------------------------------

/**
 * Mirrors the plan into Clerk publicMetadata.plan so prerendered pages can hide
 * ads client-side without an extra request. Clerk merges the patch; null
 * removes the key.
 */
export async function syncClerkPlan(userId: string, plan: PublicPlan | null): Promise<void> {
  const key = process.env.CLERK_SECRET_KEY
  if (!key) return
  const res = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(userId)}/metadata`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_metadata: { plan } }),
  })
  if (!res.ok) console.error('[entitlements] Clerk metadata sync failed', res.status)
}

export async function syncClerkPlanFromDb(db: D1Like, userId: string): Promise<PublicPlan | null> {
  const plan = publicPlanFor(await getSubscription(db, userId))
  await syncClerkPlan(userId, plan)
  return plan
}
