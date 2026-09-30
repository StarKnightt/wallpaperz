import { unstable_cache } from 'next/cache'
import { imagekitServer } from './imagekit'
import { Wallpaper, WallpaperCategory } from '@/types/wallpaper'
import { resolveCategory, cleanFilename } from '@/lib/categories'
import { PAGE_SIZE } from '@/lib/pagination'

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
    // Deterministic newest-first order: paginated list pages (/page/N) slice
    // this array, so the order must be identical across builds/revalidations.
    .sort((a: any, b: any) => {
      const byDate = String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? ''))
      return byDate !== 0 ? byDate : String(a.fileId).localeCompare(String(b.fileId))
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

// A route's ISR window is capped by the shortest unstable_cache it reads, so the
// long-tail /wallpaper/[id] and /devices/[slug] pages read this daily copy.
// Their hourly stale-hit re-renders ran past the Workers 10ms CPU cap.
export const getAllWallpapersDaily = unstable_cache(fetchAllWallpapers, ['all-wallpapers-daily'], {
  revalidate: 86400,
  tags: ['wallpapers'],
})

export async function getWallpaperById(id: string): Promise<Wallpaper | null> {
  const found = (await getAllWallpapersDaily()).find((w) => w.id === id)
  if (found) return found
  // Uploaded after the daily copy was cached.
  return (await getAllWallpapers()).find((w) => w.id === id) ?? null
}

export async function getRelatedWallpapers(wallpaper: Wallpaper, limit = 6): Promise<Wallpaper[]> {
  const all = await getAllWallpapersDaily()
  return all
    .filter((w) => w.id !== wallpaper.id && w.category === wallpaper.category)
    .slice(0, limit)
}

/** AI uploads carry the `ai-generated` tag and an "Original AI-generated ..." description. */
export function isAiGenerated(wallpaper: Wallpaper): boolean {
  return (
    !!wallpaper.tags?.some((t) => t.toLowerCase() === 'ai-generated') ||
    /\bOriginal AI-generated\b/i.test(wallpaper.description)
  )
}

/** 1-based homepage list page that contains this wallpaper (for back-links). */
export async function getHomePageNumberFor(id: string): Promise<number | null> {
  const all = await getAllWallpapersDaily()
  const index = all.findIndex((w) => w.id === id)
  return index === -1 ? null : Math.floor(index / PAGE_SIZE) + 1
}
