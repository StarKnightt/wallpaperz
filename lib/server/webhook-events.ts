import type { D1Like } from '@/lib/server/d1'

const RETENTION_MS = 30 * 24 * 60 * 60 * 1000

export async function alreadyProcessed(db: D1Like, id: string): Promise<boolean> {
  return (await db.prepare('SELECT 1 AS hit FROM webhook_events WHERE id = ?').bind(id).first()) != null
}

/**
 * Recorded only after the handler succeeded, so a failed delivery is still
 * retried. Concurrent duplicates can both run; the handlers stay idempotent.
 */
export async function markProcessed(db: D1Like, id: string, now = Date.now()): Promise<void> {
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO webhook_events (id, received_at) VALUES (?, ?)').bind(id, now),
    db.prepare('DELETE FROM webhook_events WHERE received_at < ?').bind(now - RETENTION_MS),
  ])
}
