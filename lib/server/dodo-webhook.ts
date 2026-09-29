import type { D1Like } from '@/lib/server/d1'
import { cancelSubscription, creditsForPlan, planForProduct } from '@/lib/server/dodo'
import {
  activatePlan,
  addCreditsStmt,
  findUserBySubscription,
  getSubscription,
  removeCredits,
  revokeLifetime,
  setSubscriptionStatus,
  syncClerkPlanFromDb,
  type SubStatus,
} from '@/lib/server/entitlements'

export interface DodoEvent {
  type: string
  data: Record<string, unknown> & {
    payment_id?: string
    subscription_id?: string | null
    product_id?: string
    product_cart?: Array<{ product_id: string; quantity?: number }> | null
    metadata?: Record<string, unknown> | null
    customer?: { customer_id?: string; email?: string } | null
    status?: string
    next_billing_date?: string | null
  }
}

export type HandleResult = { handled: boolean; note: string }

const toMs = (iso: unknown) => {
  const t = typeof iso === 'string' ? Date.parse(iso) : NaN
  return Number.isFinite(t) ? t : null
}

async function resolveUser(db: D1Like, data: DodoEvent['data']): Promise<string | null> {
  const fromMeta = data.metadata?.clerk_user_id
  if (typeof fromMeta === 'string' && fromMeta) return fromMeta
  if (data.subscription_id) return findUserBySubscription(db, data.subscription_id)
  return null
}

function isDuplicateError(err: unknown) {
  return /UNIQUE constraint failed|SQLITE_CONSTRAINT/i.test(String((err as Error)?.message ?? err))
}

async function onPaymentSucceeded(db: D1Like, data: DodoEvent['data'], now: number): Promise<HandleResult> {
  const paymentId = data.payment_id
  if (!paymentId) return { handled: false, note: 'no payment_id' }
  const productId = data.product_cart?.[0]?.product_id ?? ''
  let plan = planForProduct(productId)

  // Subscription renewals may arrive without a product cart; match on the subscription instead.
  if (!plan && data.subscription_id) {
    const userId = await findUserBySubscription(db, data.subscription_id)
    const sub = userId ? await getSubscription(db, userId) : null
    if (sub && sub.plan !== 'lifetime') plan = sub.plan
  }
  if (!plan) return { handled: false, note: 'not a wallpaperz product' }

  const userId = await resolveUser(db, data)
  if (!userId) {
    console.error('[dodo-webhook] payment without user mapping', paymentId)
    return { handled: false, note: 'no user' }
  }

  const credits = creditsForPlan(plan)
  const recordPayment = db
    .prepare('INSERT INTO payments (dodo_payment_id, user_id, product_id, credits, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(paymentId, userId, productId, credits, now)

  // The payment insert and the grant share one D1 batch (a transaction): a
  // redelivered event hits the primary key and rolls back the whole grant.
  try {
    await db.batch(credits > 0 ? [recordPayment, addCreditsStmt(db, userId, credits, now)] : [recordPayment])
  } catch (err) {
    if (isDuplicateError(err)) return { handled: true, note: 'duplicate payment' }
    throw err
  }

  const customerId = data.customer?.customer_id ?? null
  if (plan === 'lifetime') {
    const existing = await getSubscription(db, userId)
    await activatePlan(db, { user_id: userId, plan: 'lifetime', current_period_end: null, dodo_subscription_id: null, dodo_customer_id: customerId }, now)
    // Lifetime replaces a running subscription so it stops billing.
    if (existing && existing.plan !== 'lifetime' && existing.status === 'active' && existing.dodo_subscription_id) {
      await cancelSubscription(existing.dodo_subscription_id)
    }
  } else if (plan === 'pro_monthly' || plan === 'pro_yearly') {
    await activatePlan(
      db,
      { user_id: userId, plan, current_period_end: null, dodo_subscription_id: data.subscription_id ?? null, dodo_customer_id: customerId },
      now
    )
  }

  if (credits === 0) await syncClerkPlanFromDb(db, userId)
  return { handled: true, note: `granted ${plan}` }
}

const SUB_EVENT_STATUS: Record<string, SubStatus> = {
  'subscription.cancelled': 'cancelled',
  'subscription.expired': 'expired',
  'subscription.failed': 'failed',
  'subscription.on_hold': 'on_hold',
}

async function onSubscriptionEvent(db: D1Like, type: string, data: DodoEvent['data'], now: number): Promise<HandleResult> {
  const subId = data.subscription_id
  if (!subId) return { handled: false, note: 'no subscription_id' }
  const plan = planForProduct(data.product_id)
  if (plan !== 'pro_monthly' && plan !== 'pro_yearly') return { handled: false, note: 'not a wallpaperz subscription' }

  const userId = await resolveUser(db, data)
  if (!userId) {
    console.error('[dodo-webhook] subscription without user mapping', subId)
    return { handled: false, note: 'no user' }
  }

  const periodEnd = toMs(data.next_billing_date)
  const status: SubStatus = SUB_EVENT_STATUS[type] ?? SUB_EVENT_STATUS[`subscription.${data.status}`] ?? 'active'

  if (status === 'active') {
    await activatePlan(
      db,
      { user_id: userId, plan, current_period_end: periodEnd, dodo_subscription_id: subId, dodo_customer_id: data.customer?.customer_id ?? null },
      now
    )
  } else {
    await setSubscriptionStatus(db, userId, subId, status, periodEnd, now)
  }
  await syncClerkPlanFromDb(db, userId)
  return { handled: true, note: `subscription ${status}` }
}

/** refund.succeeded / dispute.lost: take back what the payment granted. */
async function onPaymentReversed(db: D1Like, data: DodoEvent['data'], now: number): Promise<HandleResult> {
  const paymentId = data.payment_id
  if (!paymentId) return { handled: false, note: 'no payment_id' }
  const payment = await db
    .prepare('SELECT user_id, product_id, credits, refunded_at FROM payments WHERE dodo_payment_id = ?')
    .bind(paymentId)
    .first<{ user_id: string; product_id: string; credits: number; refunded_at: number | null }>()
  if (!payment) return { handled: false, note: 'unknown payment' }
  if (payment.refunded_at) return { handled: true, note: 'already reversed' }

  const marked = await db
    .prepare('UPDATE payments SET refunded_at = ? WHERE dodo_payment_id = ? AND refunded_at IS NULL')
    .bind(now, paymentId)
    .run()
  if ((marked.meta?.changes ?? 0) === 0) return { handled: true, note: 'already reversed' }

  const userId = payment.user_id
  if (payment.credits > 0) await removeCredits(db, userId, payment.credits, now)

  const plan = planForProduct(payment.product_id)
  const sub = await getSubscription(db, userId)
  if (plan === 'lifetime') {
    await revokeLifetime(db, userId, now)
  } else if (sub && sub.plan !== 'lifetime' && sub.dodo_subscription_id && (plan === 'pro_monthly' || plan === 'pro_yearly' || !plan)) {
    // A refund alone doesn't stop renewals.
    await cancelSubscription(sub.dodo_subscription_id)
    await setSubscriptionStatus(db, userId, sub.dodo_subscription_id, 'revoked', null, now)
  }
  await syncClerkPlanFromDb(db, userId)
  return { handled: true, note: 'reversed' }
}

export async function handleDodoEvent(db: D1Like, event: DodoEvent, now = Date.now()): Promise<HandleResult> {
  const { type, data } = event
  if (!data || typeof data !== 'object') return { handled: false, note: 'no data' }

  if (type === 'payment.succeeded') return onPaymentSucceeded(db, data, now)
  if (type === 'refund.succeeded' || type === 'dispute.lost') return onPaymentReversed(db, data, now)
  if (
    type === 'subscription.active' ||
    type === 'subscription.renewed' ||
    type === 'subscription.plan_changed' ||
    type === 'subscription.updated' ||
    type in SUB_EVENT_STATUS
  ) {
    return onSubscriptionEvent(db, type, data, now)
  }
  if (type === 'payment.failed' || type === 'dispute.opened') console.warn('[dodo-webhook]', type, data.payment_id)
  return { handled: false, note: `ignored ${type}` }
}
