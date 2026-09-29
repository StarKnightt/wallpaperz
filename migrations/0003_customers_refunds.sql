-- Billing portal for every buyer, and partial refunds.
-- Apply once: npx wrangler d1 execute wallpaperz-ratelimit --remote --file=migrations/0003_customers_refunds.sql

-- Dodo customer per Clerk user, written by every payment/subscription webhook
-- (credit-pack buyers have no subscriptions row).
CREATE TABLE IF NOT EXISTS customers (
  user_id TEXT PRIMARY KEY,
  dodo_customer_id TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- amount: total charged in the smallest currency unit (NULL for payments
-- recorded before this migration). refunded_credits: credits already taken
-- back by partial refunds.
ALTER TABLE payments ADD COLUMN amount INTEGER;
ALTER TABLE payments ADD COLUMN refunded_credits INTEGER NOT NULL DEFAULT 0;

-- Idempotency ledger for refunds and lost disputes (one payment can have several partial refunds).
CREATE TABLE IF NOT EXISTS payment_reversals (
  reversal_id TEXT PRIMARY KEY,
  dodo_payment_id TEXT NOT NULL,
  amount INTEGER,
  credits_removed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reversals_payment ON payment_reversals(dodo_payment_id);
