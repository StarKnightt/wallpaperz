import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    return NextResponse.json({
      success: true,
      message: `Wallpaper ${id} liked successfully`
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to like wallpaper" },
      { status: 500 }
    )
  }
}
