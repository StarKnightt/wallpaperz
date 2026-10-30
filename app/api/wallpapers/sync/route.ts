import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
}

/** Constant-time check of `Authorization: Bearer <WALLPAPER_SYNC_SECRET>` (hashing evens out lengths). */
async function authorized(req: NextRequest): Promise<boolean> {
  const secret = process.env.WALLPAPER_SYNC_SECRET
  const header = req.headers.get('authorization') ?? ''
  if (!secret || !header.startsWith('Bearer ')) return false
  const [a, b] = await Promise.all([sha256(header.slice(7)), sha256(secret)])
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

export async function POST(req: NextRequest) {
  if (!(await authorized(req))) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  // On Cloudflare Workers (free plan, 10ms CPU/request) a hard purge is fatal:
  // it invalidates every prerendered page at once, forcing foreground SSR
  // renders (100-400ms CPU each) that cascade into exceededCpu/1102 errors
  // (verified in load tests on 2026-08-27). There, fresh content ships via a
  // rebuild (`npm run cf:deploy`), which re-prerenders all pages off-Worker.
  if (process.env.DEPLOY_TARGET === 'cloudflare') {
    return NextResponse.json({
      success: true,
      purged: false,
      message: 'Purge skipped on Cloudflare Workers. Run `npm run cf:deploy` to publish new wallpapers (pages also refresh in the background hourly via ISR).'
    })
  }

  try {
    // Purge the shared data cache and every ISR page that renders wallpaper data,
    // so new uploads show up immediately instead of waiting out the 1h revalidate.
    revalidateTag('wallpapers', { expire: 0 })
    revalidatePath('/')
    revalidatePath('/api/wallpapers')
    revalidatePath('/category/[slug]', 'page')
    revalidatePath('/color/[slug]', 'page')
    revalidatePath('/wallpaper/[id]', 'page')
    revalidatePath('/sitemap.xml')
    revalidatePath('/wallpapers-sitemap.xml')
  } catch (error) {
    console.error('[wallpapers-sync] purge failed', error)
    return NextResponse.json({ success: false, error: 'Purge failed' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    purged: true,
    message: 'Cache cleared successfully. Next request will fetch fresh data from ImageKit.'
  })
}
