// One-off takedown: deletes copyright-risk wallpapers (celebrities, K-pop,
// game art, Apple stock) from ImageKit ahead of the AdSense application.
// Usage:
//   node scripts/remove-copyrighted.mjs          -> dry run (prints matches)
//   node scripts/remove-copyrighted.mjs --apply  -> actually deletes
import ImageKit from 'imagekit'
import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"|"$/g, '')]
    })
)

const ik = new ImageKit({
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
})

const TARGET_NAMES = new Set([
  'anime-girl-windows-11-4k',
  'gaeul-ive-i-am-4k-wallpaperz.jpg',
  'tzuyu-twice-formula-of-love-break-it-4k-wallpaperz.jpg',
  'ellie-last-of-us-part-2-4k-wallpaperz.jpg',
  'minimalist-macos-warm-color-palette-2025-wallpaperz.jpeg',
  'macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-wallpaperz.jpg',
  'Macbook-Pro-M3-HD-Wallpaper-4k-wallpaperz.jpg',
  'wuchang-fallen-feathers-4k-wallpaperz.jpg',
  'gta-6-jason-and-lucia-4k-wallpaperz.jpg',
  'wonyoung-ive-kpop-4k-wallpaperz.jpg',
  'princess-mononoke-2k-wallpaper.jpg',
  'sadie-sink-2k-wallpaper.jpg',
  'anya-taylor-joy-2k-wallpaper.jpg',
  'sydney-sweeney-photoshoot-2k-wallpaper.jpg',
])

const apply = process.argv.includes('--apply')

const files = await ik.listFiles({ limit: 1000 })
const matches = files.filter(f => {
  const parts = f.filePath.split('/')
  return parts.length === 3 && parts[1] === 'wallpapers' && TARGET_NAMES.has(f.name)
})

console.log(`Matched ${matches.length} of ${TARGET_NAMES.size} target files:`)
for (const f of matches) console.log(`  - ${f.name} (${f.fileId})`)

const missing = [...TARGET_NAMES].filter(n => !matches.some(f => f.name === n))
if (missing.length) {
  console.log(`\nNot found on ImageKit (already gone?):`)
  for (const n of missing) console.log(`  - ${n}`)
}

if (!apply) {
  console.log('\nDry run only. Re-run with --apply to delete.')
  process.exit(0)
}

let deleted = 0
for (const f of matches) {
  try {
    await ik.deleteFile(f.fileId)
    deleted++
    console.log(`Deleted: ${f.name}`)
  } catch (err) {
    console.error(`FAILED: ${f.name} -> ${err?.message || err}`)
  }
}
console.log(`\nDone. Deleted ${deleted}/${matches.length}.`)
