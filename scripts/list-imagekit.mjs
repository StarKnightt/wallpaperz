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

const files = await ik.listFiles({ limit: 1000 })
console.log(`Total files: ${files.length}`)
const inWallpapers = files.filter(f => {
  const parts = f.filePath.split('/')
  return parts.length === 3 && parts[1] === 'wallpapers' && f.fileType === 'image'
})
console.log(`In /wallpapers/ (flat): ${inWallpapers.length}`)
for (const f of inWallpapers) {
  console.log(`- ${f.name} | ${f.width}x${f.height} | tags: ${JSON.stringify(f.tags)} | meta: ${JSON.stringify(f.customMetadata || {})}`)
}
