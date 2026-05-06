import { imagekitServer } from './imagekit'
import { Wallpaper, WallpaperCategory } from '@/types/wallpaper'

const categoryTags = [
  'Abstract', 'Art', 'Minimalist', 'Fantasy', 'Nature',
  'Space', 'Technology', 'Anime', 'City', 'Cars',
]

function extractCategory(file: any): WallpaperCategory {
  if (file.customMetadata?.category) return file.customMetadata.category
  if (file.tags?.length) {
    const match = file.tags.find((tag: string) =>
      categoryTags.some((cat) => cat.toLowerCase() === tag.toLowerCase())
    )
    if (match) return (match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) as WallpaperCategory
  }
  return 'Other'
}

function cleanFilename(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function toWallpaper(file: any): Wallpaper {
  const category = extractCategory(file)
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
