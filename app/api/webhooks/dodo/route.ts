import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDb } from '@/lib/server/d1'
import { verifyWebhook } from '@/lib/server/dodo'
import { handleDodoEvent, type DodoEvent } from '@/lib/server/dodo-webhook'

export async function POST(req: NextRequest) {
  const secret = process.env.DODO_WEBHOOK_SECRET
  if (!secret) {
    console.error('[dodo-webhook] DODO_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'not configured' }, { status: 500 })
  }

  const raw = await req.text()
  const ok = await verifyWebhook(
    raw,
    {
      id: req.headers.get('webhook-id'),
      timestamp: req.headers.get('webhook-timestamp'),
      signature: req.headers.get('webhook-signature'),
    },
    secret
  )
  if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })

  let event: DodoEvent
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const db = await getDb()
  if (!db) {
    console.error('[dodo-webhook] RATE_LIMIT_DB binding unavailable')
    return NextResponse.json({ error: 'storage unavailable' }, { status: 503 })
  }

  try {
    const result = await handleDodoEvent(db, event)
    console.log('[dodo-webhook]', event.type, result.note)
    return NextResponse.json({ received: true, ...result })
  } catch (err) {
    // Non-2xx makes Dodo retry; handlers are idempotent.
    console.error('[dodo-webhook] handler failed', event.type, err)
    return NextResponse.json({ error: 'handler failed' }, { status: 500 })
  }
}
