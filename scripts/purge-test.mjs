// Death-spiral simulation for the Cloudflare preview: fire the owner's
// post-upload purge (POST /api/wallpapers/sync) and immediately hammer pages
// the way real visitors would, checking for 1102/5xx errors. Not part of the app.
const BASE = 'https://wallpaperz.prasenjitt4e.workers.dev'

const sitemapRes = await fetch(`${BASE}/wallpapers-sitemap.xml`)
const xml = await sitemapRes.text()
const wallpaperUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/https?:\/\/(www\.)?wallpaperz\.in/, BASE))
  .filter((u) => u.includes('/wallpaper/'))

const targets = [
  `${BASE}/`,
  `${BASE}/category/anime`,
  `${BASE}/category/nature`,
  `${BASE}/color/dark`,
  `${BASE}/api/wallpapers`,
  ...wallpaperUrls.slice(0, 12),
]

console.log(`Purging via POST /api/wallpapers/sync ...`)
const purge = await fetch(`${BASE}/api/wallpapers/sync`, { method: 'POST' })
console.log(`Purge response: ${purge.status} ${JSON.stringify(await purge.json())}`)

for (let wave = 1; wave <= 4; wave++) {
  const t0 = Date.now()
  const results = await Promise.all(targets.map(async (url) => {
    const start = Date.now()
    try {
      const res = await fetch(url)
      await res.arrayBuffer()
      return { url, status: res.status, ms: Date.now() - start }
    } catch (e) {
      return { url, status: 'ERR:' + e.message, ms: Date.now() - start }
    }
  }))
  const bad = results.filter((r) => r.status !== 200)
  const times = results.map((r) => r.ms).sort((a, b) => a - b)
  console.log(`\nWave ${wave} (t+${((Date.now() - t0) / 1000).toFixed(1)}s): ${results.length} reqs, ` +
    `${bad.length} failures, latency p50=${times[Math.floor(times.length / 2)]}ms max=${times.at(-1)}ms`)
  bad.forEach((r) => console.log(`  FAIL ${r.status} ${r.url}`))
  if (wave < 4) await new Promise((r) => setTimeout(r, 3000))
}
console.log('\nDone.')
