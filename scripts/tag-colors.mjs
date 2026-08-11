// Auto-tags every wallpaper on ImageKit with dominant color tags
// (color-blue, color-dark, ...) used by the /color/[slug] SEO pages.
// Idempotent: re-running replaces previous color-* tags.
// Usage: node scripts/tag-colors.mjs [--dry-run]
import ImageKit from 'imagekit'
import sharp from 'sharp'
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

const ENDPOINT = env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
const dryRun = process.argv.includes('--dry-run')

const DOMINANT_SHARE = 0.2
const FALLBACK_SHARE = 0.12
const MAX_COLOR_TAGS = 3

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    default: h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s, l }
}

function bucketOf({ h, s, l }) {
  if (l < 0.14) return 'black'
  if (l > 0.87 && s < 0.3) return 'white'
  if (s < 0.1) return 'gray'
  if (h >= 345 || h < 15) return 'red'
  if (h < 40) return 'orange'
  if (h < 68) return 'yellow'
  if (h < 150) return 'green'
  if (h < 195) return 'teal'
  if (h < 255) return 'blue'
  if (h < 290) return 'purple'
  return 'pink'
}

async function analyze(file) {
  const url = `${ENDPOINT}${file.filePath}?tr=w-128`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())

  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
  const channels = info.channels
  const counts = {}
  let luminanceSum = 0
  const pixels = info.width * info.height

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const bucket = bucketOf(rgbToHsl(r, g, b))
    counts[bucket] = (counts[bucket] || 0) + 1
    luminanceSum += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  }

  const shares = Object.entries(counts)
    .map(([bucket, n]) => [bucket, n / pixels])
    .sort((a, b) => b[1] - a[1])

  let colors = shares.filter(([, share]) => share >= DOMINANT_SHARE).slice(0, MAX_COLOR_TAGS)
  if (colors.length === 0 && shares[0]?.[1] >= FALLBACK_SHARE) colors = [shares[0]]

  const tags = colors.map(([bucket]) => `color-${bucket}`)
  const meanLum = luminanceSum / pixels
  if (meanLum < 0.35) tags.push('color-dark')
  else if (meanLum > 0.65) tags.push('color-light')

  return { tags, meanLum, top: shares.slice(0, 3).map(([b, s]) => `${b}:${(s * 100).toFixed(0)}%`) }
}

const files = await ik.listFiles({ limit: 1000 })
const wallpapers = files.filter(f => {
  const parts = f.filePath.split('/')
  return parts.length === 3 && parts[1] === 'wallpapers' && f.fileType === 'image'
})
console.log(`Analyzing ${wallpapers.length} wallpapers...\n`)

function errorText(err) {
  if (err?.message) return err.message
  if (err?.help) return err.help
  try {
    return JSON.stringify(err).slice(0, 200)
  } catch {
    return String(err)
  }
}

function sameTags(a, b) {
  if (a.length !== b.length) return false
  const set = new Set(a)
  return b.every(t => set.has(t))
}

const tally = {}
let updated = 0
let unchanged = 0
let failed = 0
const CONCURRENCY = 6
for (let i = 0; i < wallpapers.length; i += CONCURRENCY) {
  const batch = wallpapers.slice(i, i + CONCURRENCY)
  await Promise.all(batch.map(async (f) => {
    try {
      const { tags, top } = await analyze(f)
      for (const t of tags) tally[t] = (tally[t] || 0) + 1
      const existing = (f.tags || []).filter(t => !t.startsWith('color-'))
      const newTags = [...existing, ...tags]
      console.log(`${f.name}\n  -> [${tags.join(', ')}] (${top.join(', ')})`)
      if (!dryRun) {
        // ImageKit rejects no-op updates, so skip files whose tags already match.
        if (sameTags(newTags, f.tags || [])) {
          unchanged++
        } else {
          await ik.updateFileDetails(f.fileId, { tags: newTags })
          updated++
        }
      }
    } catch (err) {
      failed++
      console.error(`FAILED ${f.name}: ${errorText(err)}`)
    }
  }))
}

console.log(`\n--- Tag distribution ---`)
for (const [tag, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`${tag.padEnd(14)} ${n}`)
}
console.log(dryRun ? '\nDry run - nothing written.' : `\nUpdated ${updated}, unchanged ${unchanged}, failed ${failed} of ${wallpapers.length} files.`)
