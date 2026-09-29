import type { D1Like } from '@/lib/server/d1'
import { cancelSubscription, creditsForPlan, planForProduct } from '@/lib/server/dodo'
import {
  activatePlanStmt,
  addCreditsStmt,
  findUserBySubscription,
  getSubscription,
  removeCreditsStmt,
  revokeLifetime,
  setSubscriptionStatus,
  syncClerkPlanFromDb,
  upsertCustomerStmt,
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
    /** payment.succeeded: total charged, smallest currency unit. */
    total_amount?: number
    /** refund.succeeded */
    refund_id?: string
    is_partial?: boolean
    amount?: number
    /** dispute.lost */
    dispute_id?: string
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
  const customerId = data.customer?.customer_id ?? null
  const amount = typeof data.total_amount === 'number' ? data.total_amount : null
  const existing = plan === 'lifetime' ? await getSubscription(db, userId) : null

  // Ledger row, grant and customer mapping share one D1 batch (a transaction):
  // either all of it is committed or none, and a redelivered event hits the
  // payments primary key and rolls back the whole batch.
  const stmts = [
    db
      .prepare('INSERT INTO payments (dodo_payment_id, user_id, product_id, credits, amount, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(paymentId, userId, productId, credits, amount, now),
  ]
  if (credits > 0) stmts.push(addCreditsStmt(db, userId, credits, now))
  if (plan === 'lifetime' || plan === 'pro_monthly' || plan === 'pro_yearly') {
    stmts.push(
      activatePlanStmt(
        db,
        {
          user_id: userId,
          plan,
          current_period_end: null,
          dodo_subscription_id: plan === 'lifetime' ? null : data.subscription_id ?? null,
          dodo_customer_id: customerId,
        },
        now
      )
    )
  }
  if (customerId) stmts.push(upsertCustomerStmt(db, userId, customerId, now))

  let duplicate = false
  try {
    await db.batch(stmts)
  } catch (err) {
    if (!isDuplicateError(err)) throw err
    duplicate = true
  }

  // Follow-ups outside D1 are idempotent and re-run on redelivery, so a
  // failure here (thrown -> 500 -> Dodo retries) can't be lost.
  if (plan === 'lifetime') {
    // Lifetime replaces a running subscription so it stops billing. On a retry
    // the row is already lifetime but keeps the old subscription id.
    const current = duplicate ? await getSubscription(db, userId) : null
    const subId = duplicate
      ? current?.plan === 'lifetime' && current.status === 'active' ? current.dodo_subscription_id : null
      : existing && existing.plan !== 'lifetime' && existing.status === 'active' ? existing.dodo_subscription_id : null
    if (subId && subId !== data.subscription_id) await cancelSubscription(subId)
  }
  if (credits === 0) await syncClerkPlanFromDb(db, userId)
  return { handled: true, note: duplicate ? 'duplicate payment' : `granted ${plan}` }
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

  const customerId = data.customer?.customer_id ?? null
  const stmts = [
    status === 'active'
      ? activatePlanStmt(
        db,
        { user_id: userId, plan, current_period_end: periodEnd, dodo_subscription_id: subId, dodo_customer_id: customerId },
        now
      )
      : null,
    customerId ? upsertCustomerStmt(db, userId, customerId, now) : null,
  ].filter((s) => s !== null)
  if (stmts.length) await db.batch(stmts)
  if (status !== 'active') await setSubscriptionStatus(db, userId, subId, status, periodEnd, now)
  await syncClerkPlanFromDb(db, userId)
  return { handled: true, note: `subscription ${status}` }
}

interface PaymentRow {
  user_id: string
  product_id: string
  credits: number
  amount: number | null
  refunded_credits: number
  refunded_at: number | null
}

/**
 * refund.succeeded / dispute.lost: take back what the payment granted.
 * Full reversals remove the pack's remaining credits and revoke Pro/Lifetime.
 * Partial refunds only remove credits in proportion to the refunded amount
 * (never more than the balance) and leave plans alone.
 */
async function onPaymentReversed(db: D1Like, type: string, data: DodoEvent['data'], now: number): Promise<HandleResult> {
  const paymentId = data.payment_id
  if (!paymentId) return { handled: false, note: 'no payment_id' }
  const payment = await db
    .prepare('SELECT user_id, product_id, credits, amount, refunded_credits, refunded_at FROM payments WHERE dodo_payment_id = ?')
    .bind(paymentId)
    .first<PaymentRow>()
  if (!payment) return { handled: false, note: 'unknown payment' }

  const userId = payment.user_id
  const refundAmount = typeof data.amount === 'number' ? data.amount : null
  const partial =
    type === 'refund.succeeded' &&
    (data.is_partial === true || (refundAmount != null && payment.amount != null && refundAmount < payment.amount))

  const remaining = payment.refunded_at ? 0 : Math.max(payment.credits - (payment.refunded_credits ?? 0), 0)
  let creditsToRemove = remaining
  if (partial) {
    creditsToRemove =
      refundAmount != null && payment.amount
        ? Math.min(remaining, Math.ceil((payment.credits * refundAmount) / payment.amount))
        : 0
    if (creditsToRemove === 0 && payment.credits > 0) console.warn('[dodo-webhook] partial refund without amounts', paymentId)
  }

  const reversalId = data.refund_id ?? data.dispute_id ?? `${type}:${paymentId}`
  const stmts = [
    db
      .prepare('INSERT INTO payment_reversals (reversal_id, dodo_payment_id, amount, credits_removed, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(reversalId, paymentId, refundAmount, creditsToRemove, now),
    db
      .prepare(
        `UPDATE payments SET refunded_credits = refunded_credits + ?,
           refunded_at = CASE WHEN ? THEN COALESCE(refunded_at, ?) ELSE refunded_at END
         WHERE dodo_payment_id = ?`
      )
      .bind(creditsToRemove, partial ? 0 : 1, now, paymentId),
  ]
  if (creditsToRemove > 0) stmts.push(removeCreditsStmt(db, userId, creditsToRemove, now))

  let duplicate = false
  try {
    await db.batch(stmts)
  } catch (err) {
    if (!isDuplicateError(err)) throw err
    duplicate = true
  }
  if (partial) return { handled: true, note: duplicate ? 'duplicate reversal' : `partial refund, -${creditsToRemove} credits` }

  // Plan revocation is idempotent and re-runs on redelivery.
  const plan = planForProduct(payment.product_id)
  const sub = await getSubscription(db, userId)
  if (plan === 'lifetime') {
    await revokeLifetime(db, userId, now)
  } else if (
    sub && sub.plan !== 'lifetime' && sub.status !== 'revoked' && sub.dodo_subscription_id &&
    (plan === 'pro_monthly' || plan === 'pro_yearly' || !plan)
  ) {
    // A refund alone doesn't stop renewals. Cancel first: if it throws, the retry finds the row unrevoked.
    await cancelSubscription(sub.dodo_subscription_id)
    await setSubscriptionStatus(db, userId, sub.dodo_subscription_id, 'revoked', null, now)
  }
  await syncClerkPlanFromDb(db, userId)
  return { handled: true, note: duplicate ? 'duplicate reversal' : 'reversed' }
}

export async function handleDodoEvent(db: D1Like, event: DodoEvent, now = Date.now()): Promise<HandleResult> {
  const { type, data } = event
  if (!data || typeof data !== 'object') return { handled: false, note: 'no data' }

  if (type === 'payment.succeeded') return onPaymentSucceeded(db, data, now)
  if (type === 'refund.succeeded' || type === 'dispute.lost') return onPaymentReversed(db, type, data, now)
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
