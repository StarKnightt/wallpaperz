# Cloudflare Workers deployment (free plan)

The site runs as Worker `wallpaperz` built with `@opennextjs/cloudflare`.
Preview URL: https://wallpaperz.prasenjitt4e.workers.dev
(Production DNS currently points at Vercel; this doc covers the Workers setup.)

## Why the setup looks the way it does

The Workers **free plan allows ~10ms CPU per request**. A fresh Next.js SSR
render costs 100–500ms CPU, so the site only works if visitor requests never
trigger foreground renders:

- **Every page is prerendered at build.** `app/wallpaper/[id]/page.tsx`
  populates `generateStaticParams` from ImageKit, so all wallpaper pages (plus
  categories, colors, blog, sitemaps) are built ahead of time and seeded into
  the R2 incremental cache on deploy.
- **Cache interception** (`enableCacheInterception` in `open-next.config.ts`)
  serves those cached pages straight from R2 without booting NextServer:
  ~3–5ms CPU per request instead of ~10ms+.
- **The hard cache purge is disabled on Workers.** `POST /api/wallpapers/sync`
  returns `purged: false` when `DEPLOY_TARGET=cloudflare` (set in
  `wrangler.jsonc`). A tag purge invalidates every page at once and forces
  concurrent foreground renders — load-tested twice (2026-08-27), this
  reliably cascades into `exceededCpu` / 1102 errors on the free plan.
  The purge still works on Vercel, which doesn't set `DEPLOY_TARGET`.

Measured after these fixes (full-site crawl, 316 requests + on-demand 404s):
0 errors, 0 `exceededCpu`, CPU p50=5ms / p90=8ms / p99=80ms.

## Owner workflow: publishing new wallpapers (Cloudflare)

1. Upload images as usual (`npm run wallpapers:upload`, metadata scripts, etc.).
2. Run:

   ```bash
   npm run cf:deploy
   ```

   This rebuilds the site (fetching the fresh wallpaper list from ImageKit at
   build time), prerenders every page including the new ones, re-seeds the R2
   cache, and deploys. Takes ~2–3 minutes. New wallpapers are live immediately
   after, already cached — no visitor ever pays a render.

Notes:

- On Vercel the old flow is unchanged: `POST /api/wallpapers/sync` purges the
  data cache and ISR pages.
- Without a redeploy, Workers pages still refresh in the background via ISR
  (`revalidate = 3600`), so content self-heals within ~1–2 hours anyway; the
  redeploy is just the fast, guaranteed path.
- A wallpaper uploaded but not yet redeployed renders on demand on first visit
  (~100–500ms CPU). Isolated on-demand renders complete fine; only
  mass-concurrent renders are dangerous, which is exactly what the disabled
  purge used to cause.

## Bindings (wrangler.jsonc)

- R2 `NEXT_INC_CACHE_R2_BUCKET` → `wallpaperz-inc-cache` (incremental cache)
- DO `NEXT_CACHE_DO_QUEUE` → `DOQueueHandler` (ISR revalidation queue)
- D1 `NEXT_TAG_CACHE_D1` → `wallpaperz-tag-cache` (tag cache; effectively
  dormant now that the purge is disabled on Workers)
- `DEPLOY_TARGET=cloudflare` var (purge guard, see above)

Secrets (Clerk, ImageKit, …) are set on the Worker; local builds read
`.env.production.local` (never commit).
