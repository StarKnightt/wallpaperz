import { MetadataRoute } from 'next'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import { qualifyingColors, COLOR_DEFS } from '@/lib/colors'
import { BLOG_POSTS } from '@/lib/blog/registry'

const categories = [
  'abstract', 'anime', 'art', 'cars', 'city', 'fantasy', 'gaming',
  'nature', 'people', 'space', 'technology', 'minimalist', 'mobile', '4k', 'other',
]

// Colors known to meet the inventory threshold; used if the live check fails
const FALLBACK_COLOR_SLUGS = ['dark', 'black', 'blue', 'gray', 'orange', 'teal', 'red', 'pink']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wallpaperz.in'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/ai-generate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/license`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Only color pages with real inventory get published (thin pages 404)
  let colorSlugs = FALLBACK_COLOR_SLUGS
  try {
    const all = await getAllWallpapers()
    colorSlugs = qualifyingColors(all).map(({ color }) => color.slug)
  } catch {
    // keep fallback list
  }
  const colorPages: MetadataRoute.Sitemap = colorSlugs
    .filter((slug) => COLOR_DEFS.some((c) => c.slug === slug))
    .map((slug) => ({
      url: `${baseUrl}/color/${slug}`,
      lastModified: new Date(),
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
  return [...staticPages, ...categoryPages, ...colorPages, ...blogPages]
}
