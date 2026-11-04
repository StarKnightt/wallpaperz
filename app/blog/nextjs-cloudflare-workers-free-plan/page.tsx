import { Metadata } from 'next'
import Link from 'next/link'
import PostLayout from '@/components/blog/PostLayout'
import { postMetadata } from '@/lib/blog/registry'

export const metadata: Metadata = postMetadata('nextjs-cloudflare-workers-free-plan')

const REPO = 'https://github.com/StarKnightt/wallpaperz'

export default function Page() {
  return (
    <PostLayout slug="nextjs-cloudflare-workers-free-plan">
      <p>
        Wallpaperz is a Next.js 16 app served from Cloudflare Workers through the{' '}
        <a href="https://opennext.js.org/cloudflare" rel="noopener">OpenNext Cloudflare adapter</a>, on
        the free plan. The free plan gives each request roughly <strong>10ms of CPU time</strong>. A
        fresh Next.js server render of one of our pages costs 100-500ms. So the whole setup comes down
        to one rule: a visitor&apos;s request must never pay for a render. Here is what broke on the way
        there and what fixed it. The full source is <a href={REPO} rel="noopener">on GitHub</a>.
      </p>

      <h2>1. Prerender every page at build time</h2>
      <p>
        Every wallpaper page lists its IDs in <code>generateStaticParams</code>, fed by the same single
        ImageKit list call that builds the sitemaps. Categories, colors, device pages, the blog and the
        sitemaps are all built ahead of time too. On deploy, OpenNext seeds those pages into an R2
        bucket that acts as the incremental cache. A new wallpaper uploaded after a build still renders
        on demand on its first visit. One render like that at a time is fine; the danger is many at
        once, which comes up in section 3.
      </p>

      <h2>2. Serve cache hits without booting Next.js</h2>
      <p>
        Even a cache hit was expensive at first: loading the Next.js server just to return a cached
        page took about 10ms of CPU, the entire budget. OpenNext&apos;s cache interception fixes that
        by answering cached ISR and SSG responses straight from R2, before Next.js starts:
      </p>
      <pre><code>{`// open-next.config.ts
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: memoryQueue,
  tagCache: d1NextTagCache,
  enableCacheInterception: true,
});`}</code></pre>
      <p>
        With interception on, the cache lookup itself costs about 1ms, and a whole request typically
        lands at 3-5ms.
      </p>

      <h2>3. Never purge the whole cache</h2>
      <p>
        The original publishing flow purged the cache after each upload with{' '}
        <code>revalidateTag</code> and <code>revalidatePath</code>, so new wallpapers showed up
        straight away. On Workers that is fatal. A tag purge invalidates every prerendered page at
        once, the next visitors all trigger foreground renders together, and each one blows through
        the CPU limit. We load-tested it twice with a script that fires the purge and then requests
        pages the way real visitors would. Both times it cascaded into <code>exceededCpu</code> and
        error 1102 responses.
      </p>
      <p>
        The fix is to publish by redeploying instead. The build re-prerenders every page on our own
        machine, off the Worker, and reseeds R2. It takes two to three minutes, and no visitor ever
        pays for a render. The purge endpoint now returns <code>purged: false</code> when it detects
        the Workers deployment and says to redeploy instead.
      </p>

      <h2>4. Revalidate long-tail pages daily, not hourly</h2>
      <p>
        Pages still refresh in the background through ISR between deploys. But every stale hit
        triggers a background re-render, and that render runs past the 10ms cap too. Individual
        wallpaper pages are visited rarely, so they were nearly always stale when someone arrived,
        which meant hourly revalidation kept tripping <code>exceededCpu</code>. Those pages and the
        device pages now use <code>revalidate = 86400</code>. List pages stay hourly.
      </p>

      <h2>5. Swap the Durable Object queue for the memory queue</h2>
      <p>
        OpenNext&apos;s default revalidation queue runs on a Durable Object. Ours used around 4,000 to
        5,000 seconds of Durable Object duration a day, a large share of the free allowance, just to
        de-duplicate hourly refreshes. The version we ran could also retry-loop on confirmations it
        misread as failures (
        <a href="https://github.com/opennextjs/opennextjs-cloudflare/issues/662" rel="noopener">opennextjs-cloudflare#662</a>
        ). The memory queue revalidates directly. The worst case without de-duplication is an
        occasional duplicate render, and a missed revalidation is simply retried on the next stale hit.
      </p>

      <h2>6. The <code>__name</code> bug that broke the theme script</h2>
      <p>
        After the move, every page rendered by the Worker threw a <code>ReferenceError</code> from the
        inline theme script. Wrangler bundles with esbuild&apos;s <code>keep_names</code> option, which
        wraps functions in a <code>__name()</code> helper so they keep their names. next-themes turns
        its anti-flash function into a string and inlines it as a <code>&lt;script&gt;</code>. In the
        browser, that inlined copy still calls <code>__name</code>, which doesn&apos;t exist there. The
        fix is one line in <code>wrangler.jsonc</code>:
      </p>
      <pre><code>{`"keep_names": false`}</code></pre>

      <h2>7. Put redirects in the routing layer</h2>
      <p>
        We changed wallpaper URLs from <code>/wallpaper/&lt;id&gt;</code> to{' '}
        <code>/wallpaper/&lt;slug&gt;-&lt;id&gt;</code>. Throwing <code>redirect()</code> inside the ISR
        page did not work: OpenNext cached the result as a 200 response with a client-side redirect,
        not a real 308. Generating the old-to-new mappings at build time in{' '}
        <code>next.config.js</code> <code>redirects()</code> gives proper permanent redirects. That
        matters for old Pinterest pins and pages Google had already indexed.
      </p>

      <h2>The result</h2>
      <p>
        A full-site crawl after these changes (316 requests, plus some deliberate 404s) returned 0
        errors and 0 <code>exceededCpu</code>, with CPU time per request at p50 5ms, p90 8ms and p99
        80ms. The p99 is the occasional on-demand render, and isolated ones like that finish fine.
      </p>

      <h2>Checklist if you&apos;re doing the same</h2>
      <ul>
        <li>Prerender everything you can with <code>generateStaticParams</code>.</li>
        <li>Turn on <code>enableCacheInterception</code> with the R2 incremental cache.</li>
        <li>Never purge everything at once on the free plan. Publish by rebuilding.</li>
        <li>Give rarely visited pages a long <code>revalidate</code>.</li>
        <li>Consider the memory queue if Durable Object duration is adding up.</li>
        <li>Set <code>&quot;keep_names&quot;: false</code> if you inline stringified functions, as next-themes does.</li>
        <li>Do redirects in <code>next.config.js</code>, not inside ISR pages.</li>
      </ul>
      <p>
        The code is all in the <a href={REPO} rel="noopener">Wallpaperz repository</a>. And if you
        came for the wallpapers, they&apos;re all <Link href="/">free to download</Link>.
      </p>
    </PostLayout>
  )
}
