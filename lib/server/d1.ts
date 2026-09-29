import { getCloudflareContext } from '@opennextjs/cloudflare'

export interface D1Statement {
  bind(...values: unknown[]): D1Statement
  first<T = Record<string, unknown>>(): Promise<T | null>
  run(): Promise<{ meta?: { last_row_id?: number; changes?: number } }>
}

export interface D1Like {
  prepare(sql: string): D1Statement
  batch(statements: D1Statement[]): Promise<Array<{ meta?: { last_row_id?: number; changes?: number } }>>
}

/** RATE_LIMIT_DB binding (wallpaperz-ratelimit); null under `next dev`, which has no D1. */
export async function getDb(): Promise<D1Like | null> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    return ((env as Record<string, unknown>).RATE_LIMIT_DB as D1Like) ?? null
  } catch {
    return null
  }
}
