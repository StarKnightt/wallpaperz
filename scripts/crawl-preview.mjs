// Load-verification crawler for the Cloudflare preview deployment.
// Usage: node scripts/crawl-preview.mjs [passes]
// Collects every URL from both sitemaps plus fixed routes, fetches each
// N times (default 2), and reports status codes + latency. Not part of the app.
const BASE = 'https://wallpaperz.prasenjitt4e.workers.dev'
const passes = Number(process.argv[2] ?? 2)

async function getSitemapUrls(path) {
  const res = await fetch(`${BASE}${path}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replace(/https?:\/\/(www\.)?wallpaperz\.in/, BASE)
  )
}

const fixed = [
  `${BASE}/`,
  `${BASE}/api/wallpapers`,
  `${BASE}/sitemap.xml`,
  `${BASE}/wallpapers-sitemap.xml`,
  `${BASE}/robots.txt`,
]

const urls = [...new Set([
  ...fixed,
  ...(await getSitemapUrls('/sitemap.xml')),
  ...(await getSitemapUrls('/wallpapers-sitemap.xml')),
])]

console.log(`Crawling ${urls.length} unique URLs x ${passes} passes`)

const results = { total: 0, byStatus: {}, failures: [], latencies: [] }

for (let pass = 1; pass <= passes; pass++) {
  const t0 = Date.now()
  // Batch to avoid hammering; 10 concurrent
  for (let i = 0; i < urls.length; i += 10) {
    const batch = urls.slice(i, i + 10)
    await Promise.all(batch.map(async (url) => {
      const start = Date.now()
      try {
        const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30000) })
        await res.arrayBuffer()
        const ms = Date.now() - start
        results.total++
        results.byStatus[res.status] = (results.byStatus[res.status] ?? 0) + 1
        results.latencies.push(ms)
        if (res.status >= 400) results.failures.push(`[pass ${pass}] ${res.status} ${url}`)
      } catch (e) {
        results.total++
        results.byStatus.ERR = (results.byStatus.ERR ?? 0) + 1
        results.failures.push(`[pass ${pass}] ERR ${url} ${e.message}`)
      }
    }))
  }
  console.log(`Pass ${pass} done in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
}

results.latencies.sort((a, b) => a - b)
const pct = (p) => results.latencies[Math.floor(results.latencies.length * p)] ?? 0
console.log(`\nTotal requests: ${results.total}`)
console.log(`Status counts: ${JSON.stringify(results.byStatus)}`)
console.log(`Latency ms: p50=${pct(0.5)} p90=${pct(0.9)} p99=${pct(0.99)} max=${results.latencies.at(-1)}`)
if (results.failures.length) {
  console.log(`\nFailures (${results.failures.length}):`)
  results.failures.slice(0, 30).forEach((f) => console.log('  ' + f))
} else {
  console.log('\nNo failures.')
}
