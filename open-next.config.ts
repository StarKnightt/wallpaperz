// OpenNext adapter config for the Cloudflare Workers deployment (cf:* scripts).
// Vercel ignores this file entirely.
//
// Cache architecture (per https://opennext.js.org/cloudflare/caching):
// - Incremental cache: R2 (bucket wallpaperz-inc-cache, binding
//   NEXT_INC_CACHE_R2_BUCKET in wrangler.jsonc) — the docs' first choice.
// - Queue: memory queue (direct revalidation via WORKER_SELF_REFERENCE).
//   Replaced the Durable Object queue: the DO burned ~4-5k s/day of the shared
//   free-plan DO duration budget just to dedupe hourly ISR refreshes, and this
//   OpenNext version can retry-loop on confirmations it misreads as failures
//   (opennextjs-cloudflare#662). Worst case without dedup is a rare duplicate
//   render; a missed revalidation is retried on the next stale hit.
// - Tag cache: D1 ("next mode") so revalidateTag('wallpapers')/revalidatePath
//   from POST /api/wallpapers/sync purge instantly.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: memoryQueue,
  tagCache: d1NextTagCache,
  // Serve cached ISR/SSG responses directly from R2 without booting NextServer.
  // Cache HITs previously cost ~10ms CPU (the whole free-plan budget) just to
  // load Next; with interception they cost ~1ms. Runs after middleware.
  enableCacheInterception: true,
});
