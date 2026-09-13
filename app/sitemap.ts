import { MetadataRoute } from 'next'
import { getAllWallpapers } from '@/lib/server/wallpapers'

// Refresh hourly instead of only on deploy, so new color pages appear
// without a redeploy and crawl hits never recompute per request.
export const revalidate = 3600
import { qualifyingColors, COLOR_DEFS, wallpapersForColor } from '@/lib/colors'
import { BLOG_POSTS } from '@/lib/blog/registry'
import { CATEGORY_SLUGS, wallpapersForCategory } from '@/lib/category-pages'
import { pageHref, totalPagesFor } from '@/lib/pagination'
import { Wallpaper } from '@/types/wallpaper'

const categories = CATEGORY_SLUGS

// No <lastmod> on list/static pages: it used to be `new Date()` on every
// hourly regeneration, which Google detects as fake and then ignores for the
// whole file. Blog posts keep their real publish date.

/** /base/page/2 ... /base/page/N for a list of `count` wallpapers (page 1 is the base URL). */
function paginatedEntries(basePath: string, count: number, priority: number): MetadataRoute.Sitemap {
  const pages = totalPagesFor(count)
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({
    url: `https://www.wallpaperz.in${pageHref(basePath, i + 2)}`,
    changeFrequency: 'daily' as const,
    priority,
  }))
}

// Colors known to meet the inventory threshold; used if the live check fails
const FALLBACK_COLOR_SLUGS = ['dark', 'black', 'blue', 'gray', 'orange', 'teal', 'red', 'pink']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.wallpaperz.in'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/ai-generate`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/license`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Only color pages with real inventory get published (thin pages 404)
  let colorSlugs = FALLBACK_COLOR_SLUGS
  let all: Wallpaper[] = []
  try {
    all = await getAllWallpapers()
    colorSlugs = qualifyingColors(all).map(({ color }) => color.slug)
  } catch {
    // keep fallback list; paginated entries below are simply omitted
  }

  // Paginated list pages (/page/2, /category/x/page/2, /color/x/page/2)
  const paginatedPages: MetadataRoute.Sitemap = [
    ...paginatedEntries('/', all.length, 0.9),
    ...categories.flatMap((slug) => paginatedEntries(`/category/${slug}`, wallpapersForCategory(all, slug).length, 0.7)),
    ...COLOR_DEFS.filter((c) => colorSlugs.includes(c.slug)).flatMap((c) =>
      paginatedEntries(`/color/${c.slug}`, wallpapersForColor(all, c).length, 0.7)
    ),
  ]
  const colorPages: MetadataRoute.Sitemap = colorSlugs
    .filter((slug) => COLOR_DEFS.some((c) => c.slug === slug))
    .map((slug) => ({
      url: `${baseUrl}/color/${slug}`,
      changeFrequency: 'daily',
      priority: 0.8,
    }))

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Wallpaper pages live in /wallpapers-sitemap.xml (route handler) because
  // Next's MetadataRoute.Sitemap cannot emit <image:image> entries, which
  // Google Images needs to index the actual wallpaper files.
  return [...staticPages, ...paginatedPages, ...categoryPages, ...colorPages, ...blogPages]
}
