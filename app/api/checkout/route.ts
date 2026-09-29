import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { isPlanKey } from '@/lib/pricing'
import { DISCOUNT_CODE_RE, createCheckoutSession, productForPlan } from '@/lib/server/dodo'
import { getDb } from '@/lib/server/d1'
import { getSubscription, subscriptionGrantsPro } from '@/lib/server/entitlements'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Sign in to continue', code: 'UNAUTHENTICATED' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const plan = body?.plan
  if (!isPlanKey(plan)) return NextResponse.json({ error: 'Unknown plan' }, { status: 400 })

  const rawCode = typeof body?.discountCode === 'string' ? body.discountCode.trim() : ''
  if (rawCode && !DISCOUNT_CODE_RE.test(rawCode)) {
    return NextResponse.json({ error: "That discount code doesn't look right.", code: 'INVALID_DISCOUNT' }, { status: 400 })
  }
  const discountCode = rawCode || undefined

  const productId = productForPlan(plan)
  if (!productId || !process.env.DODO_PAYMENTS_API_KEY) {
    console.error('[checkout] missing Dodo configuration for', plan)
    return NextResponse.json({ error: 'Payments are not configured yet' }, { status: 503 })
  }

  if (plan !== 'credits_50' && plan !== 'credits_150') {
    const db = await getDb()
    const sub = db ? await getSubscription(db, userId) : null
    if (subscriptionGrantsPro(sub)) {
      const lifetime = sub!.plan === 'lifetime'
      // Upgrading an active subscription to Lifetime is allowed (the webhook cancels the subscription).
      if (lifetime || plan !== 'lifetime') {
        return NextResponse.json(
          { error: lifetime ? 'You already have Lifetime access.' : 'You already have Pro.', code: 'ALREADY_PRO' },
          { status: 409 }
        )
      }
    }
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || undefined
  const origin = req.nextUrl.origin

  const result = await createCheckoutSession({
    productId,
    userId,
    plan,
    email,
    name,
    returnUrl: `${origin}/ai-generate?paid=1`,
    cancelUrl: `${origin}/pricing?cancelled=1`,
    discountCode,
  })
  if ('error' in result) {
    if (result.error === 'invalid_discount') {
      return NextResponse.json(
        { error: "That discount code isn't valid for this purchase, or it has already been used.", code: 'INVALID_DISCOUNT' },
        { status: 400 }
      )
    }
    if (result.error === 'timeout') {
      return NextResponse.json({ error: 'Checkout is taking too long to respond. Please try again.' }, { status: 504 })
    }
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 502 })
  }
  return NextResponse.json({ url: result.url })
}
