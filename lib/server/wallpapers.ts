import { unstable_cache } from 'next/cache'
import { imagekitServer } from './imagekit'
import { Wallpaper, WallpaperCategory } from '@/types/wallpaper'
import { resolveCategory, cleanFilename } from '@/lib/categories'

function toWallpaper(file: any): Wallpaper {
  const category = resolveCategory(file.customMetadata?.category, file.tags) as WallpaperCategory
  return {
    id: file.fileId,
    title: file.customMetadata?.title || cleanFilename(file.name),
    imageUrl: file.filePath,
    category,
    description: file.customMetadata?.description || `A beautiful ${category.toLowerCase()} wallpaper`,
    source: file.customMetadata?.source || file.tags?.find((t: string) => ['pexels', 'unsplash', 'pixabay'].includes(t.toLowerCase())) || 'imagekit',
    sourceUrl: file.customMetadata?.sourceUrl || undefined,
    width: file.width,
    height: file.height,
    fileSize: file.size,
    tags: file.tags || [],
  }
}

async function fetchAllWallpapers(): Promise<Wallpaper[]> {
  const files = await imagekitServer.listFiles({ limit: 1000 })
  return (files || [])
    .filter((f: any) => {
      const parts = f.filePath.split('/')
      return parts.length === 3 && parts[1] === 'wallpapers' && f.fileType === 'image'
    })
    .map(toWallpaper)
}

// Vercel Data Cache (shared across lambda instances, unlike module-level memory).
// One ImageKit list call per hour serves every route; POST /api/wallpapers/sync
// purges the 'wallpapers' tag for an instant refresh.
export const getAllWallpapers = unstable_cache(fetchAllWallpapers, ['all-wallpapers'], {
  revalidate: 3600,
  tags: ['wallpapers'],
})

export async function getWallpaperById(id: string): Promise<Wallpaper | null> {
  const all = await getAllWallpapers()
  return all.find((w) => w.id === id) ?? null
}

export async function getRelatedWallpapers(wallpaper: Wallpaper, limit = 6): Promise<Wallpaper[]> {
  const all = await getAllWallpapers()
  return all
    .filter((w) => w.id !== wallpaper.id && w.category === wallpaper.category)
    .slice(0, limit)
}
