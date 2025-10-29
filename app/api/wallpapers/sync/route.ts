import { NextResponse } from 'next/server'
import { imagekitServer } from '@/lib/server/imagekit'
import { Wallpaper } from '@/types/wallpaper'

// Simple in-memory cache
let cache: {
  data: Wallpaper[] | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
const WALLPAPERS_FOLDER = '/wallpapers' // Your ImageKit folder path

/**
 * Extract category from ImageKit tags or custom metadata
 * If no category found, defaults to "Other"
 */
function extractCategory(file: any): string {
  // First, check custom metadata
  if (file.customMetadata?.category) {
    return file.customMetadata.category
  }
  
  // Second, check tags for category
  if (file.tags && file.tags.length > 0) {
    // Look for category tags (Abstract, Art, Nature, etc.)
    const categoryTags = ['Abstract', 'Art', 'Minimalist', 'Fantasy', 'Nature', 'Space', 'Technology', 'Anime', 'City', 'Cars']
    const foundCategory = file.tags.find((tag: string) => 
      categoryTags.some(cat => cat.toLowerCase() === tag.toLowerCase())
    )
    if (foundCategory) {
      // Capitalize first letter
      return foundCategory.charAt(0).toUpperCase() + foundCategory.slice(1).toLowerCase()
    }
  }
  
  return 'Other'
}

/**
 * Clean filename to create a readable title
 * Example: "beautiful-sunset-4k.jpg" -> "Beautiful Sunset 4k"
 */
function cleanFilename(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
}

/**
 * Transform ImageKit file to Wallpaper format
 */
function transformToWallpaper(file: any): Wallpaper {
  const category = extractCategory(file)
  
  return {
    id: file.fileId,
    title: file.customMetadata?.title || cleanFilename(file.name),
    imageUrl: file.filePath, // Store relative path, getImageUrl() will handle full URL
    category: category as any, // Use tags or custom metadata for category
    description: file.customMetadata?.description || `A beautiful ${category.toLowerCase()} wallpaper`,
    source: file.customMetadata?.source || file.tags?.find((t: string) => ['pexels', 'unsplash', 'pixabay'].includes(t.toLowerCase())) || 'imagekit',
    sourceUrl: file.customMetadata?.sourceUrl || undefined
  }
}

export async function GET() {
  try {
    // Check cache
    const now = Date.now()
    const isCacheValid = cache.data && (now - cache.timestamp) < CACHE_DURATION
    
    if (isCacheValid && cache.data) {
      return NextResponse.json({
        success: true,
        wallpapers: cache.data,
        source: 'cache',
        cached: true,
        cacheAge: Math.floor((now - cache.timestamp) / 1000), // seconds
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

    // Transform ImageKit files to Wallpaper format
    const wallpapers: Wallpaper[] = response
      .filter((file: any) => {
        // Only include image files DIRECTLY in /wallpapers/ folder (no subfolders)
        // Example: /wallpapers/image.jpg ✅   /wallpapers/Abstract/image.jpg ❌
        const pathParts = file.filePath.split('/')
        const isDirectlyInWallpapers = pathParts.length === 3 && pathParts[1] === 'wallpapers'
        
        // Trust ImageKit's fileType instead of checking extensions
        // (files might not have extensions in their paths)
        const isImageFile = file.fileType === 'image'
        
        return isDirectlyInWallpapers && isImageFile
      })
      .map(transformToWallpaper)
      .sort((a, b) => a.title.localeCompare(b.title)) // Sort alphabetically
    
    if (wallpapers.length === 0) {
      return NextResponse.json({
        success: true,
        wallpapers: [],
        source: 'imagekit',
        message: 'No wallpapers found. Upload images to ImageKit folder: ' + WALLPAPERS_FOLDER
      })
    }

    // Update cache
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
    
    // Return error with helpful message
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wallpapers from ImageKit',
        message: error instanceof Error ? error.message : 'Unknown error',
        wallpapers: [], // Return empty array as fallback
      },
      { status: 500 }
    )
  }
}

/**
 * POST endpoint to manually clear cache
 * Useful when you add new wallpapers and want immediate update
 */
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

