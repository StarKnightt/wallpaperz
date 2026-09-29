// Display prices and allowances shared by the pricing page, the generator UI
// and the server. Dodo product IDs live in env vars (lib/server/dodo.ts).

export const FREE_PER_DAY = 5
export const PRO_PER_MONTH = 300

export type PlanKey = 'credits_50' | 'credits_150' | 'pro_monthly' | 'pro_yearly' | 'lifetime'

export const PLANS: Record<PlanKey, { label: string; priceUsd: number; credits?: number }> = {
  credits_50: { label: '50 credits', priceUsd: 3, credits: 50 },
  credits_150: { label: '150 credits', priceUsd: 8, credits: 150 },
  pro_monthly: { label: 'Pro monthly', priceUsd: 5 },
  pro_yearly: { label: 'Pro yearly', priceUsd: 40 },
  lifetime: { label: 'Lifetime', priceUsd: 29 },
}

export function isPlanKey(v: unknown): v is PlanKey {
  return typeof v === 'string' && v in PLANS
}

/** Value written to Clerk publicMetadata.plan; the client reads it to hide ads. */
export type PublicPlan = 'pro' | 'lifetime'

export function isAdFreePlan(plan: unknown): plan is PublicPlan {
  return plan === 'pro' || plan === 'lifetime'
}

export type LimitCode = 'FREE_LIMIT' | 'GLOBAL_LIMIT' | 'PRO_LIMIT' | 'PAID_GLOBAL_LIMIT'

/** Shape returned by /api/me/entitlements and embedded in /api/ai-generate responses. */
export interface Entitlements {
  plan: 'free' | 'pro' | 'lifetime'
  free: { used: number; limit: number; remaining: number; resetAt: number | null }
  pro: { used: number; limit: number; remaining: number; resetAt: number | null; periodEnd: number | null; status: string } | null
  credits: number
}
