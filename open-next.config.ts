// OpenNext adapter config for the Cloudflare Workers deployment (cf:* scripts).
// Vercel ignores this file entirely.
//
// Cache architecture (per https://opennext.js.org/cloudflare/caching):
// - Incremental cache: R2 (bucket wallpaperz-inc-cache, binding
//   NEXT_INC_CACHE_R2_BUCKET in wrangler.jsonc) — the docs' first choice.
// - Queue: Durable Object queue for time-based ISR revalidation (revalidate=3600).
// - Tag cache: D1 ("next mode") so revalidateTag('wallpapers')/revalidatePath
//   from POST /api/wallpapers/sync purge instantly.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: doQueue,
  tagCache: d1NextTagCache,
});
