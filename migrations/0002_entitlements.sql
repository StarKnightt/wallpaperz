-- Paid AI generation: credits, Pro subscriptions, lifetime deals.
-- Apply once: npx wrangler d1 execute wallpaperz-ratelimit --remote --file=migrations/0002_entitlements.sql

-- Which allowance paid for each generation: 'free' | 'pro' | 'credit'.
ALTER TABLE ai_generations ADD COLUMN source TEXT NOT NULL DEFAULT 'free';
CREATE INDEX IF NOT EXISTS idx_gen_source_time ON ai_generations(source, created_at);
CREATE INDEX IF NOT EXISTS idx_gen_user_source_time ON ai_generations(user_id, source, created_at);

CREATE TABLE IF NOT EXISTS user_credits (
  user_id TEXT PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at INTEGER NOT NULL
);

-- One row per Clerk user. plan: 'pro_monthly' | 'pro_yearly' | 'lifetime'.
-- status: 'active' | 'cancelled' | 'on_hold' | 'expired' | 'failed' | 'revoked'.
-- current_period_end is epoch ms (NULL for lifetime).
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id TEXT PRIMARY KEY,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_end INTEGER,
  dodo_subscription_id TEXT,
  dodo_customer_id TEXT,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sub_dodo_sub ON subscriptions(dodo_subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_dodo_customer ON subscriptions(dodo_customer_id);

-- Idempotency ledger for one-time payments (credit packs, lifetime) and
-- subscription charges. refunded_at is set when a refund/lost dispute is applied.
CREATE TABLE IF NOT EXISTS payments (
  dodo_payment_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  refunded_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
