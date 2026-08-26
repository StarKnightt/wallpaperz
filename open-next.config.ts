// OpenNext adapter config for the Cloudflare Workers deployment (cf:* scripts).
// Vercel ignores this file entirely.
//
// Cache architecture (per https://opennext.js.org/cloudflare/caching):
// - Incremental cache: Workers KV (R2 is the docs' first choice, but R2 is not
//   enabled on this Cloudflare account yet; KV is the documented alternative
//   and free-tier friendly). Swap to r2-incremental-cache once R2 is enabled.
// - Queue: Durable Object queue for time-based ISR revalidation (revalidate=3600).
// - Tag cache: D1 ("next mode") so revalidateTag('wallpapers')/revalidatePath
//   from POST /api/wallpapers/sync purge instantly.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  queue: doQueue,
  tagCache: d1NextTagCache,
});
