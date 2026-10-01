import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDb } from '@/lib/server/d1'
import { verifyWebhook } from '@/lib/server/dodo'
import { handleClerkEvent, type ClerkEvent } from '@/lib/server/clerk-webhook'

// Clerk delivers through Svix, which signs with the same Standard Webhooks
// scheme as Dodo under svix-* header names.
export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET
  if (!secret) {
    console.error('[clerk-webhook] CLERK_WEBHOOK_SIGNING_SECRET is not set')
    return NextResponse.json({ error: 'not configured' }, { status: 500 })
  }

  const raw = await req.text()
  const ok = await verifyWebhook(
    raw,
    {
      id: req.headers.get('svix-id'),
      timestamp: req.headers.get('svix-timestamp'),
      signature: req.headers.get('svix-signature'),
    },
    secret
  )
  if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })

  let event: ClerkEvent
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const db = await getDb()
  if (!db) {
    console.error('[clerk-webhook] RATE_LIMIT_DB binding unavailable')
    return NextResponse.json({ error: 'storage unavailable' }, { status: 503 })
  }

  try {
    const result = await handleClerkEvent(db, event)
    console.log('[clerk-webhook]', event.type, result.note)
    return NextResponse.json({ received: true, ...result })
  } catch (err) {
    // Non-2xx makes Svix retry; erasing is idempotent.
    console.error('[clerk-webhook] handler failed', event.type, err)
    return NextResponse.json({ error: 'handler failed' }, { status: 500 })
  }
}
