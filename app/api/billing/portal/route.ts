import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/server/d1'
import { getSubscription } from '@/lib/server/entitlements'
import { apiBase } from '@/lib/server/dodo'

// Link with a plain <a>, never next/link: prefetching would mint portal sessions.
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(new URL('/sign-in?redirect_url=/pricing', req.url))

  const db = await getDb()
  const sub = db ? await getSubscription(db, userId) : null
  if (!sub?.dodo_customer_id) return NextResponse.redirect(new URL('/pricing?billing=none', req.url))

  const returnUrl = encodeURIComponent(`${req.nextUrl.origin}/pricing`)
  const res = await fetch(
    `${apiBase()}/customers/${encodeURIComponent(sub.dodo_customer_id)}/customer-portal/session?return_url=${returnUrl}`,
    { method: 'POST', headers: { Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}` } }
  )
  const data = (await res.json().catch(() => ({}))) as { link?: string }
  if (!res.ok || !data.link) {
    console.error('[portal] Dodo portal session failed', res.status)
    return NextResponse.redirect(new URL('/pricing?billing=error', req.url))
  }
  return NextResponse.redirect(data.link)
}
