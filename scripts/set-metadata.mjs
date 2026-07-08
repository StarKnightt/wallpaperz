/**
 * Backfill customMetadata (title/description) on already-uploaded wallpapers.
 * Usage: node scripts/set-metadata.mjs <manifest.json>
 */
import ImageKit from 'imagekit'
import { readFileSync } from 'fs'
import path from 'path'

const env = Object.fromEntries(
  readFileSync(path.join(process.cwd(), '.env'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"|"$/g, '')]
    })
)

const ik = new ImageKit({
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
})

const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const files = await ik.listFiles({ path: 'wallpapers', limit: 1000 })
const byName = new Map(files.map((f) => [f.name, f]))

for (const entry of manifest) {
  const file = byName.get(entry.fileName)
  if (!file) {
    console.warn(`Not found on ImageKit: ${entry.fileName}`)
    continue
  }
  const customMetadata = {}
  if (entry.title) customMetadata.title = entry.title
  if (entry.description) customMetadata.description = entry.description
  if (Object.keys(customMetadata).length === 0) continue
  try {
    await ik.updateFileDetails(file.fileId, { customMetadata })
    console.log(`Updated metadata: ${entry.fileName}`)
  } catch (err) {
    console.error(`Failed ${entry.fileName}: ${err.message}`)
  }
}
console.log('Done.')
