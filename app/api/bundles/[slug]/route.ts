import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isPro } from '@/lib/server/entitlements'

// Premium wallpaper bundle downloads (Pro/Lifetime perk).
// TODO: once bundle ZIPs are hosted (e.g. a private R2 bucket), look up `slug`
// and return a short-lived signed URL or stream the object. Not advertised on
// /pricing until this ships.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHENTICATED' }, { status: 401 })
  if (!(await isPro(userId))) return NextResponse.json({ error: 'Pro required', code: 'PRO_REQUIRED' }, { status: 403 })

  const { slug } = await params
  return NextResponse.json({ error: `Bundle "${slug}" is not available yet`, code: 'NOT_AVAILABLE' }, { status: 404 })
}
