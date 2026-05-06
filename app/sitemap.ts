import { MetadataRoute } from 'next'
import { getAllWallpapers } from '@/lib/server/wallpapers'

const categories = [
  'abstract', 'anime', 'art', 'cars', 'city', 'fantasy',
  'nature', 'space', 'technology', 'minimalist', '4k', 'other',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wallpaperz.in'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/ai-generate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
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

  let wallpaperPages: MetadataRoute.Sitemap = []
  try {
    const wallpapers = await getAllWallpapers()
    wallpaperPages = wallpapers.map((w) => ({
      url: `${baseUrl}/wallpaper/${w.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    console.error('Failed to fetch wallpapers for sitemap')
  }

  return [...staticPages, ...categoryPages, ...wallpaperPages]
}
