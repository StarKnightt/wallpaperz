-- Webhook dedupe, out-of-order subscription events, Clerk plan repair throttle.
-- Additive only. Apply once: npx wrangler d1 execute wallpaperz-ratelimit --remote --file=migrations/0004_webhook_dedupe.sql

-- Delivery IDs (webhook-id / svix-id, prefixed with the sender) already
-- handled successfully, so redeliveries are acknowledged without re-running.
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  received_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_webhook_events_time ON webhook_events(received_at);

-- Epoch ms of the newest Dodo event applied to the row; older events for the
-- same subscription (e.g. a delayed 'active' after 'cancelled') are skipped.
ALTER TABLE subscriptions ADD COLUMN last_event_at INTEGER;

-- Last time /api/me/entitlements rewrote a user's Clerk publicMetadata.plan.
CREATE TABLE IF NOT EXISTS clerk_plan_repairs (
  user_id TEXT PRIMARY KEY,
  repaired_at INTEGER NOT NULL
);
