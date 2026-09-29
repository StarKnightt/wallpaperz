import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getEntitlements } from '@/lib/server/ai-rate-limit'
import { syncClerkPlan } from '@/lib/server/entitlements'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entitlements = await getEntitlements(userId)

  // The client passes the plan it sees in Clerk publicMetadata. If it drifted
  // (e.g. a cancelled period ran out with no webhook), repair it here.
  const clerkPlan = req.nextUrl.searchParams.get('clerkPlan') || null
  const actual = entitlements.plan === 'free' ? null : entitlements.plan
  if (req.nextUrl.searchParams.has('clerkPlan') && clerkPlan !== actual) {
    await syncClerkPlan(userId, actual)
  }

  return NextResponse.json(entitlements, { headers: { 'Cache-Control': 'private, no-store' } })
}
