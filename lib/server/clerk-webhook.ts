import type { D1Like } from '@/lib/server/d1'
import { cancelSubscription } from '@/lib/server/dodo'
import { getSubscription } from '@/lib/server/entitlements'

/** Placeholder owner for payment rows of deleted accounts (kept for tax/accounting). */
export const DELETED_USER_ID = 'deleted_user'

export interface ClerkEvent {
  type: string
  data?: { id?: unknown; deleted?: boolean } | null
}

export type EraseResult = { handled: boolean; note: string }

/**
 * Erases everything keyed to a deleted Clerk user. Usage logs, credits, plan
 * and the Dodo customer mapping are deleted; payment rows stay for the
 * accounting retention period but lose the user ID, so a later refund or
 * dispute for them still finds the payment and simply has no one to debit.
 * Safe to re-run: a redelivered event finds nothing left to change.
 */
export async function eraseUser(db: D1Like, userId: string): Promise<EraseResult> {
  // A deleted account can't reach the billing portal, so stop renewals here.
  // Throws on Dodo 5xx/network errors, so the webhook is retried before any row is gone.
  const sub = await getSubscription(db, userId)
  if (
    sub?.dodo_subscription_id &&
    sub.plan !== 'lifetime' &&
    (sub.status === 'active' || sub.status === 'on_hold')
  ) {
    await cancelSubscription(sub.dodo_subscription_id)
  }

  const results = await db.batch([
    db.prepare('DELETE FROM ai_generations WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM user_credits WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM subscriptions WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM customers WHERE user_id = ?').bind(userId),
    db.prepare('UPDATE payments SET user_id = ? WHERE user_id = ?').bind(DELETED_USER_ID, userId),
  ])
  const changes = results.map((r) => r.meta?.changes ?? 0)
  return { handled: true, note: `erased generations=${changes[0]} credits=${changes[1]} subscriptions=${changes[2]} customers=${changes[3]} payments_anonymised=${changes[4]}` }
}

export async function handleClerkEvent(db: D1Like, event: ClerkEvent): Promise<EraseResult> {
  if (event.type !== 'user.deleted') return { handled: false, note: `ignored ${event.type}` }
  const userId = event.data?.id
  if (typeof userId !== 'string' || !userId.startsWith('user_')) return { handled: false, note: 'no user id' }
  return eraseUser(db, userId)
}
