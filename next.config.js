/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Keep in sync with slugify() in lib/wallpaper-url.ts. If they ever drift, the
// page-level redirect in app/wallpaper/[id] still lands on the canonical URL.
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '')
}

// Mirrors cleanFilename() in lib/categories.ts (casing is irrelevant once slugified)
function cleanName(filename) {
  const drop = new Set(['wallpaperz', 'wallpaper', 'wallpapers'])
  return filename.replace(/\.[^/.]+$/, '').split(/[-_\s]+/).filter((t) => t && !drop.has(t.toLowerCase())).join(' ')
}

// Old /wallpaper/<id> URLs (Pinterest pins, existing index entries) 308 to
// /wallpaper/<slug>-<id> at the routing layer. A redirect thrown inside the ISR
// page gets cached by OpenNext as a 200 with a client-side redirect instead.
async function legacyWallpaperRedirects() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) return []
  try {
    const ImageKit = require('imagekit')
    const ik = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
    })
    const files = await ik.listFiles({ limit: 1000 })
    return files
      .filter((f) => {
        const parts = f.filePath.split('/')
        return parts.length === 3 && parts[1] === 'wallpapers' && f.fileType === 'image'
      })
      .map((f) => {
        const title = (f.customMetadata && f.customMetadata.title) || cleanName(f.name)
        const slug = slugify(title)
        return slug && { source: `/wallpaper/${f.fileId}`, destination: `/wallpaper/${slug}-${f.fileId}`, permanent: true }
      })
      .filter(Boolean)
  } catch (err) {
    console.warn('[next.config] legacy wallpaper redirects skipped:', err.message)
    return []
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile images
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub profile images
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Clerk user avatars
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  // Vercel serves /public files with `max-age=0, must-revalidate`, so browsers
  // send a conditional GET for these on every page load and each 304 counts
  // against the edge-request quota. These assets never change in place (any
  // change ships under a new filename), so mark them immutable.
  async headers() {
    return [
      {
        source: '/:file(favicon.png|theimage.png|apple-touch-icon.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png|web-app-manifest-192x192-maskable.png|web-app-manifest-512x512-maskable.png)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Manifest content can change, so cache for a day instead of forever
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        // Service worker must always be revalidated so a new deploy takes over
        // promptly (the browser also caps SW script caching at 24h).
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/offline.html',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
        ],
      },
    ]
  },
  // Page 1 of every paginated list is the bare list URL; /page/1 variants
  // 308 there so there is exactly one canonical URL per page.
  async redirects() {
    return [
      { source: '/page/1', destination: '/', permanent: true },
      { source: '/category/:slug/page/1', destination: '/category/:slug', permanent: true },
      { source: '/color/:slug/page/1', destination: '/color/:slug', permanent: true },
      // Vanity links. These used to be rewrites, which proxied github.com's
      // profile HTML under wallpaperz.in/github (a duplicate of an external
      // page for Google) and 404'd for x.com, which refuses to be proxied.
      { source: '/github', destination: 'https://github.com/StarKnightt', permanent: false },
      { source: '/twitter', destination: 'https://x.com/Star_Knight12', permanent: false },
      ...(await legacyWallpaperRedirects()),
    ]
  },
}

module.exports = withBundleAnalyzer(nextConfig)
