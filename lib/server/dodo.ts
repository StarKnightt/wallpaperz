import { PLANS, type PlanKey } from '@/lib/pricing'

const PLAN_ENV: Record<PlanKey, string> = {
  credits_50: 'DODO_PRODUCT_CREDITS_50',
  credits_150: 'DODO_PRODUCT_CREDITS_150',
  pro_monthly: 'DODO_PRODUCT_PRO_MONTHLY',
  pro_yearly: 'DODO_PRODUCT_PRO_YEARLY',
  lifetime: 'DODO_PRODUCT_LIFETIME',
}

export function apiBase(): string {
  return process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode'
    ? 'https://live.dodopayments.com'
    : 'https://test.dodopayments.com'
}

export function productForPlan(plan: PlanKey): string | null {
  return process.env[PLAN_ENV[plan]] || null
}

/** Maps a Dodo product ID back to our plan; null for products of other apps on the same Dodo account. */
export function planForProduct(productId: string | null | undefined): PlanKey | null {
  if (!productId) return null
  for (const plan of Object.keys(PLAN_ENV) as PlanKey[]) {
    if (process.env[PLAN_ENV[plan]] === productId) return plan
  }
  return null
}

export function creditsForPlan(plan: PlanKey): number {
  return PLANS[plan].credits ?? 0
}

async function dodoFetch(method: string, path: string, body?: unknown): Promise<Response> {
  return fetch(`${apiBase()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

export async function createCheckoutSession(opts: {
  productId: string
  userId: string
  plan: PlanKey
  email?: string
  name?: string
  returnUrl: string
  cancelUrl: string
}): Promise<{ url: string } | { error: string; status: number }> {
  const res = await dodoFetch('POST', '/checkouts', {
    product_cart: [{ product_id: opts.productId, quantity: 1 }],
    ...(opts.email ? { customer: { email: opts.email, ...(opts.name ? { name: opts.name } : {}) } } : {}),
    return_url: opts.returnUrl,
    cancel_url: opts.cancelUrl,
    // Webhooks map the payment back to the Clerk user through this.
    metadata: { clerk_user_id: opts.userId, plan: opts.plan, app: 'wallpaperz' },
  })
  const data = (await res.json().catch(() => ({}))) as { checkout_url?: string; message?: string }
  if (res.ok && data.checkout_url) return { url: data.checkout_url }
  console.error('[dodo] checkout failed', res.status, data?.message)
  return { error: 'checkout_failed', status: res.status }
}

/** Immediate cancel; a refund alone would leave the subscription renewing. */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const res = await dodoFetch('PATCH', `/subscriptions/${encodeURIComponent(subscriptionId)}`, { status: 'cancelled' })
  if (!res.ok) console.error('[dodo] cancel subscription failed', subscriptionId, res.status)
}

// ---- Standard Webhooks signature -------------------------------------------

const TOLERANCE_SECONDS = 5 * 60

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function bytesToBase64(bytes: ArrayBuffer): string {
  let bin = ''
  const view = new Uint8Array(bytes)
  for (let i = 0; i < view.length; i++) bin += String.fromCharCode(view[i])
  return btoa(bin)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * Verifies `webhook-signature` = base64(HMAC-SHA256(secret, `${id}.${timestamp}.${body}`)),
 * where the secret is the base64 part of `whsec_...`. The header may carry
 * several space-separated `v1,<sig>` entries during secret rotation.
 */
export async function verifyWebhook(
  rawBody: string,
  headers: { id: string | null; timestamp: string | null; signature: string | null },
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000)
): Promise<boolean> {
  const { id, timestamp, signature } = headers
  if (!id || !timestamp || !signature || !secret) return false
  const ts = Number(timestamp)
  if (!Number.isFinite(ts) || Math.abs(nowSeconds - ts) > TOLERANCE_SECONDS) return false

  const keyBytes = base64ToBytes(secret.startsWith('whsec_') ? secret.slice(6) : secret)
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${id}.${timestamp}.${rawBody}`))
  const expected = bytesToBase64(mac)

  return signature
    .split(' ')
    .map((part) => part.split(','))
    .some(([version, sig]) => version === 'v1' && !!sig && timingSafeEqual(sig, expected))
}
