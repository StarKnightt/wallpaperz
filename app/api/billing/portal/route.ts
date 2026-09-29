import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/server/d1'
import { getDodoCustomerId } from '@/lib/server/entitlements'
import { dodoFetch } from '@/lib/server/dodo'

// Link with a plain <a>, never next/link: prefetching would mint portal sessions.
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(new URL('/sign-in?redirect_url=/pricing', req.url))

  const db = await getDb()
  const customerId = db ? await getDodoCustomerId(db, userId) : null
  if (!customerId) return NextResponse.redirect(new URL('/pricing?billing=none', req.url))

  const returnUrl = encodeURIComponent(`${req.nextUrl.origin}/pricing`)
  try {
    const res = await dodoFetch('POST', `/customers/${encodeURIComponent(customerId)}/customer-portal/session?return_url=${returnUrl}`)
    const data = (await res.json().catch(() => ({}))) as { link?: string }
    if (res.ok && data.link) return NextResponse.redirect(data.link)
    console.error('[portal] Dodo portal session failed', res.status)
  } catch (err) {
    console.error('[portal] Dodo portal request failed', (err as Error)?.name)
  }
  return NextResponse.redirect(new URL('/pricing?billing=error', req.url))
}
