import { getAllWallpapers } from '@/lib/server/wallpapers'

const BASE_URL = 'https://wallpaperz.in'
const IMAGEKIT_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight'

// Next 15 stopped caching GET route handlers by default; force-static keeps
// this sitemap served from cache instead of rebuilding per crawler hit.
export const dynamic = 'force-static'
export const revalidate = 3600

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  let entries = ''
  try {
    const wallpapers = await getAllWallpapers()
    entries = wallpapers
      .map((w) => {
        const rawUrl = w.imageUrl.startsWith('http')
          ? w.imageUrl
          : `${IMAGEKIT_ENDPOINT}${w.imageUrl}`
        const imageUrl = encodeURI(rawUrl)
        return `  <url>
    <loc>${BASE_URL}/wallpaper/${w.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(w.title)}</image:title>
      <image:caption>${escapeXml(w.description)}</image:caption>
    </image:image>
  </url>`
      })
      .join('\n')
  } catch {
    console.error('Failed to build wallpapers sitemap')
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
