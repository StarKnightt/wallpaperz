/* Wallpaperz service worker (hand-rolled; no next-pwa/serwist).
 *
 * Strategy
 * - Navigations / HTML: network-first, never cached. Pages are ISR'd and carry
 *   AdSense markup, so stale HTML is never acceptable. If the network fails we
 *   answer with the precached /offline.html.
 * - /_next/static/* and the app icons: cache-first. Hashed, immutable assets.
 * - Everything else is NOT intercepted: ImageKit (ik.imagekit.io) images, /api/*,
 *   Clerk, AdSense, GA, Clarity, Cloudflare beacon. The fetch handler returns
 *   without calling respondWith, so the browser handles them exactly as if no
 *   service worker were installed.
 *
 * Bump CACHE_VERSION whenever this file's caching behaviour changes; activate()
 * deletes every wallpaperz-* cache that is not the current one.
 */
const CACHE_VERSION = 'v1'
const STATIC_CACHE = `wallpaperz-static-${CACHE_VERSION}`
const OFFLINE_URL = '/offline.html'

const PRECACHE = ['/web-app-manifest-192x192-maskable.png']

// Same-origin paths served cache-first. Only immutable / rarely-changing files.
const STATIC_PATH_PATTERNS = [
  /^\/_next\/static\//,
  /^\/web-app-manifest-\d+x\d+(-maskable)?\.png$/,
  /^\/apple-touch-icon\.png$/,
  /^\/favicon\.png$/,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => Promise.all([cache.addAll(PRECACHE), precacheOfflinePage(cache)]))
      .then(() => self.skipWaiting())
  )
})

// Cloudflare Workers Assets 307s "/offline.html" -> "/offline" (auto trailing-
// slash handling) while `next start`/Vercel serve it at "/offline.html". Follow
// whatever redirect the host does and store a fresh Response under OFFLINE_URL:
// Chrome refuses to answer a navigation with a response whose `redirected` flag
// is set, so we must not cache the fetched Response object as-is.
async function precacheOfflinePage(cache) {
  const res = await fetch(OFFLINE_URL, { redirect: 'follow', cache: 'no-cache' })
  if (!res.ok) throw new Error(`offline page ${res.status}`)
  const body = await res.text()
  await cache.put(
    OFFLINE_URL,
    new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  )
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('wallpaperz-') && key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  // Third-party (ImageKit, AdSense, GA, Clerk, ...) -> untouched.
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request))
    return
  }

  if (STATIC_PATH_PATTERNS.some((re) => re.test(url.pathname))) {
    event.respondWith(cacheFirst(request))
  }
  // Anything else same-origin (/api/*, /manifest.json, /sw.js, sitemaps, ...)
  // falls through to the network untouched.
})

async function networkFirstNavigation(request) {
  try {
    return await fetch(request)
  } catch {
    const cached = await caches.match(OFFLINE_URL)
    return (
      cached ||
      new Response('You are offline.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      })
    )
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  // Only persist real, complete same-origin 200s (skip 206/opaque/errors).
  if (response.ok && response.type === 'basic') {
    cache.put(request, response.clone()).catch(() => {})
  }
  return response
}
