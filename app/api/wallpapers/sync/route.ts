import { NextResponse } from 'next/server'
import { imagekitServer } from '@/lib/server/imagekit'
import { Wallpaper } from '@/types/wallpaper'
import { resolveCategory, cleanFilename } from '@/lib/categories'

let cache: {
  data: Wallpaper[] | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 60 * 60 * 1000
const WALLPAPERS_FOLDER = '/wallpapers'

function transformToWallpaper(file: any): Wallpaper {
  const category = resolveCategory(file.customMetadata?.category, file.tags)
  
  return {
    id: file.fileId,
    title: file.customMetadata?.title || cleanFilename(file.name),
    imageUrl: file.filePath,
    category: category as any,
    description: file.customMetadata?.description || `A beautiful ${category.toLowerCase()} wallpaper`,
    source: file.customMetadata?.source || file.tags?.find((t: string) => ['pexels', 'unsplash', 'pixabay'].includes(t.toLowerCase())) || 'imagekit',
    sourceUrl: file.customMetadata?.sourceUrl || undefined,
    width: file.width,
    height: file.height,
    fileSize: file.size
  }
}

export async function GET() {
  try {
    const now = Date.now()
    const isCacheValid = cache.data && (now - cache.timestamp) < CACHE_DURATION
    
    if (isCacheValid && cache.data) {
      return NextResponse.json({
        success: true,
        wallpapers: cache.data,
        source: 'cache',
        cached: true,
        cacheAge: Math.floor((now - cache.timestamp) / 1000),
      })
    }

    const response = await imagekitServer.listFiles({
      limit: 1000, 
    })
    
    if (!response || response.length === 0) {
      return NextResponse.json({
        success: true,
        wallpapers: [],
        source: 'imagekit',
        message: 'No wallpapers found. Upload images to ImageKit folder: ' + WALLPAPERS_FOLDER
      })
    }

    const wallpapers: Wallpaper[] = response
      .filter((file: any) => {
        const pathParts = file.filePath.split('/')
        const isDirectlyInWallpapers = pathParts.length === 3 && pathParts[1] === 'wallpapers'
        const isImageFile = file.fileType === 'image'
        
        return isDirectlyInWallpapers && isImageFile
      })
      .map(transformToWallpaper)
      .sort((a, b) => a.title.localeCompare(b.title))
    
    if (wallpapers.length === 0) {
      return NextResponse.json({
        success: true,
        wallpapers: [],
        source: 'imagekit',
        message: 'No wallpapers found. Upload images to ImageKit folder: ' + WALLPAPERS_FOLDER
      })
    }

    cache = {
      data: wallpapers,
      timestamp: now
    }

    return NextResponse.json({
      success: true,
      wallpapers,
      source: 'imagekit',
      count: wallpapers.length,
      cached: false,
    })

  } catch (error) {
    console.error('Error fetching wallpapers from ImageKit:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wallpapers from ImageKit',
        message: error instanceof Error ? error.message : 'Unknown error',
        wallpapers: [],
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  cache = {
    data: null,
    timestamp: 0
  }
  
  return NextResponse.json({
    success: true,
    message: 'Cache cleared successfully. Next request will fetch fresh data from ImageKit.'
  })
}

