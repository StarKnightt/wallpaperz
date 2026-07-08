/**
 * Wallpaper upload pipeline.
 *
 * Processes images from a source directory (crop to 16:9 desktop / 9:16 mobile,
 * upscale to 2K, optimize as progressive JPEG) and uploads them to the ImageKit
 * /wallpapers folder with tags + custom metadata.
 *
 * Usage:
 *   node scripts/upload-wallpapers.mjs manifest.json
 *
 * The manifest is a JSON array of entries:
 *   {
 *     "src": "absolute/or/relative/path.png",
 *     "fileName": "my-wallpaper-2k-wallpaperz.jpg",
 *     "tags": ["nature"],
 *     "title": "Optional pretty title",
 *     "description": "Optional description for SEO"
 *   }
 *
 * Reads ImageKit credentials from .env in the repo root.
 */
import ImageKit from 'imagekit'
import sharp from 'sharp'
import { readFileSync } from 'fs'
import path from 'path'

const DESKTOP = { width: 2560, height: 1440 }
const MOBILE = { width: 1440, height: 2560 }
const FOLDER = '/wallpapers'

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env')
  return Object.fromEntries(
    readFileSync(envPath, 'utf8')
      .split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => {
        const idx = l.indexOf('=')
        return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"|"$/g, '')]
      })
  )
}

const env = loadEnv()
const ik = new ImageKit({
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
})

async function ensureMetadataFields() {
  const wanted = [
    { name: 'title', label: 'Title' },
    { name: 'description', label: 'Description' },
    { name: 'category', label: 'Category' },
  ]
  let available = false
  for (const field of wanted) {
    try {
      await ik.createCustomMetadataField({
        name: field.name,
        label: field.label,
        schema: { type: 'Text' },
      })
      console.log(`Created custom metadata field: ${field.name}`)
      available = true
    } catch (err) {
      // 400 = already exists, which is fine
      const exists = err?.$ResponseMetadata?.statusCode === 400 || /already exists/i.test(err?.message || '')
      if (exists) available = true
      else console.warn(`Could not create metadata field ${field.name}: ${err?.message || err}`)
    }
  }
  return available
}

async function processImage(srcPath) {
  const meta = await sharp(srcPath).metadata()
  const isPortrait = meta.height > meta.width
  const target = isPortrait ? MOBILE : DESKTOP
  const buffer = await sharp(srcPath)
    .resize(target.width, target.height, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6 })
    .jpeg({ quality: 87, progressive: true, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer()
  return { buffer, ...target }
}

async function main() {
  const manifestPath = process.argv[2]
  if (!manifestPath) {
    console.error('Usage: node scripts/upload-wallpapers.mjs <manifest.json>')
    process.exit(1)
  }
  const entries = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const hasMetadata = await ensureMetadataFields()

  for (const entry of entries) {
    const { buffer, width, height } = await processImage(entry.src)
    const sizeKb = Math.round(buffer.length / 1024)

    const options = {
      file: buffer,
      fileName: entry.fileName,
      folder: FOLDER,
      tags: entry.tags,
      useUniqueFileName: false,
    }
    if (hasMetadata && (entry.title || entry.description)) {
      options.customMetadata = {}
      if (entry.title) options.customMetadata.title = entry.title
      if (entry.description) options.customMetadata.description = entry.description
    }

    const result = await ik.upload(options)
    console.log(`Uploaded ${entry.fileName} (${width}x${height}, ${sizeKb} KB) -> ${result.url}`)
  }
  console.log(`\nDone. ${entries.length} wallpapers uploaded to ${FOLDER}/`)
  console.log('Clear the site cache so they appear: curl -X POST https://www.wallpaperz.in/api/wallpapers/sync')
}

main().catch((err) => {
  console.error('Upload failed:', err.message || err)
  process.exit(1)
})
