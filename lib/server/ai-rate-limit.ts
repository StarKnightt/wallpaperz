import { getCloudflareContext } from '@opennextjs/cloudflare'

export const AI_LIMITS = {
  perUserPerHour: 5,
  /** Site-wide ceiling so many throwaway accounts can't drain Stability credits. */
  globalPerDay: 150,
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

interface D1Like {
  prepare(sql: string): {
    bind(...values: unknown[]): {
      first<T = Record<string, unknown>>(): Promise<T | null>
      run(): Promise<{ meta?: { last_row_id?: number } }>
    }
  }
}

export type LimitResult =
  | { allowed: true; remaining: number; resetTime: number; release: () => Promise<void> }
  | { allowed: false; remaining: 0; resetTime: number; reason: 'user' | 'global' }

async function getDb(): Promise<D1Like | null> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    return ((env as Record<string, unknown>).RATE_LIMIT_DB as D1Like) ?? null
  } catch {
    return null
  }
}

// Dev fallback only (`next dev` has no D1 binding); per-isolate and not durable.
const memory = new Map<string, number[]>()

/**
 * Reserves one generation for the user if both limits allow it. Call
 * `release()` when the upstream generation fails so the attempt isn't counted.
 */
export async function reserveGeneration(userId: string): Promise<LimitResult> {
  const now = Date.now()
  const db = await getDb()

  if (!db) {
    const times = (memory.get(userId) ?? []).filter((t) => t > now - HOUR)
    if (times.length >= AI_LIMITS.perUserPerHour) {
      return { allowed: false, remaining: 0, resetTime: times[0] + HOUR, reason: 'user' }
    }
    times.push(now)
    memory.set(userId, times)
    return {
      allowed: true,
      remaining: AI_LIMITS.perUserPerHour - times.length,
      resetTime: times[0] + HOUR,
      release: async () => { memory.set(userId, (memory.get(userId) ?? []).filter((t) => t !== now)) },
    }
  }

  const user = await db
    .prepare('SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM ai_generations WHERE user_id = ? AND created_at > ?')
    .bind(userId, now - HOUR)
    .first<{ n: number; oldest: number | null }>()
  if ((user?.n ?? 0) >= AI_LIMITS.perUserPerHour) {
    return { allowed: false, remaining: 0, resetTime: (user?.oldest ?? now) + HOUR, reason: 'user' }
  }

  const global = await db
    .prepare('SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM ai_generations WHERE created_at > ?')
    .bind(now - DAY)
    .first<{ n: number; oldest: number | null }>()
  if ((global?.n ?? 0) >= AI_LIMITS.globalPerDay) {
    return { allowed: false, remaining: 0, resetTime: (global?.oldest ?? now) + DAY, reason: 'global' }
  }

  const inserted = await db
    .prepare('INSERT INTO ai_generations (user_id, created_at) VALUES (?, ?)')
    .bind(userId, now)
    .run()
  const rowId = inserted.meta?.last_row_id

  return {
    allowed: true,
    remaining: AI_LIMITS.perUserPerHour - (user?.n ?? 0) - 1,
    resetTime: (user?.oldest ?? now) + HOUR,
    release: async () => {
      if (rowId != null) await db.prepare('DELETE FROM ai_generations WHERE id = ?').bind(rowId).run()
    },
  }
}
