-- Baseline for the RATE_LIMIT_DB (wallpaperz-ratelimit) D1 database.
-- Already applied in production; kept so a fresh database can be recreated.
CREATE TABLE IF NOT EXISTS ai_generations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_gen_user_time ON ai_generations(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_gen_time ON ai_generations(created_at);
