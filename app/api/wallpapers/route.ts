import { NextResponse } from 'next/server'
import { getAllWallpapers } from '@/lib/server/wallpapers'

// GET-only route handler so Next can cache it (a POST in the same file would
// force dynamic). Served from the edge cache; revalidated hourly or instantly
// via POST /api/wallpapers/sync.
export const revalidate = 3600

export async function GET() {
  try {
    const wallpapers = (await getAllWallpapers())
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))

    return NextResponse.json({
      success: true,
      wallpapers,
      count: wallpapers.length,
      source: 'imagekit',
    })
  } catch (error) {
    console.error('Error fetching wallpapers:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wallpapers',
        message: error instanceof Error ? error.message : 'Unknown error',
        wallpapers: [],
      },
      { status: 500 }
    )
  }
}
