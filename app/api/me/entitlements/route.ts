import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getEntitlements } from '@/lib/server/ai-rate-limit'
import { getDb } from '@/lib/server/d1'
import { syncClerkPlan } from '@/lib/server/entitlements'

/** Each repair is a Clerk API call the client can trigger, so allow one per user per window. */
const REPAIR_INTERVAL_MS = 10 * 60 * 1000

async function claimRepair(userId: string, now: number): Promise<boolean> {
  const db = await getDb()
  if (!db) return true
  const res = await db
    .prepare(
      `INSERT INTO clerk_plan_repairs (user_id, repaired_at) VALUES (?, ?)
       ON CONFLICT(user_id) DO UPDATE SET repaired_at = excluded.repaired_at
       WHERE clerk_plan_repairs.repaired_at <= ?`
    )
    .bind(userId, now, now - REPAIR_INTERVAL_MS)
    .run()
  return res.meta?.changes === 1
}

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entitlements = await getEntitlements(userId)

  // The client passes the plan it sees in Clerk publicMetadata. If it drifted
  // (e.g. a cancelled period ran out with no webhook), repair it here.
  // Webhooks sync the plan directly, so throttling this path only delays drift repair.
  const clerkPlan = req.nextUrl.searchParams.get('clerkPlan') || null
  const actual = entitlements.plan === 'free' ? null : entitlements.plan
  if (req.nextUrl.searchParams.has('clerkPlan') && clerkPlan !== actual && (await claimRepair(userId, Date.now()))) {
    await syncClerkPlan(userId, actual)
  }

  return NextResponse.json(entitlements, { headers: { 'Cache-Control': 'private, no-store' } })
}
