// Throwaway local D1 (Miniflare) with every migration applied, plus a bundler
// for server modules so their `@/` imports resolve. No network.
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { getPlatformProxy } from 'wrangler'

const BUNDLE_DIR = join('node_modules', '.cache', 'wz-tests')

export async function importServerModule(entry) {
  const outfile = join(BUNDLE_DIR, `${entry.replace(/[^a-z0-9]+/gi, '_')}-${process.pid}.mjs`)
  await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    external: ['@opennextjs/cloudflare'],
    logLevel: 'silent',
  })
  return import(pathToFileURL(outfile).href)
}

export async function startD1() {
  const dir = mkdtempSync(join(tmpdir(), 'wz-d1-'))
  const proxy = await getPlatformProxy({ configPath: 'wrangler.jsonc', persist: { path: join(dir, 'state') } })
  const db = proxy.env.RATE_LIMIT_DB
  for (const file of readdirSync('migrations').filter((f) => f.endsWith('.sql')).sort()) {
    const sql = readFileSync(join('migrations', file), 'utf8').replace(/--.*$/gm, '')
    for (const stmt of sql.split(';').map((s) => s.trim()).filter(Boolean)) await db.prepare(stmt).run()
  }
  return {
    db,
    async stop() {
      await proxy.dispose()
      rmSync(dir, { recursive: true, force: true })
      rmSync(BUNDLE_DIR, { recursive: true, force: true })
    },
  }
}
