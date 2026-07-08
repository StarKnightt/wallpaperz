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
  }
}

let cachedWallpapers: Wallpaper[] | null = null
let cacheTime = 0
const CACHE_TTL = 60 * 60 * 1000

export async function getAllWallpapers(): Promise<Wallpaper[]> {
  const now = Date.now()
  if (cachedWallpapers && now - cacheTime < CACHE_TTL) return cachedWallpapers

  const files = await imagekitServer.listFiles({ limit: 1000 })
  const wallpapers = (files || [])
    .filter((f: any) => {
      const parts = f.filePath.split('/')
      return parts.length === 3 && parts[1] === 'wallpapers' && f.fileType === 'image'
    })
    .map(toWallpaper)

  cachedWallpapers = wallpapers
  cacheTime = now
  return wallpapers
}

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
