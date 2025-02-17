import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { wallpaperId } = await req.json()
  
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        wallpaperId,
      }
    })
    return NextResponse.json(favorite)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
  }
} 