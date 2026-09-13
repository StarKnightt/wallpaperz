import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import {
  COLOR_DEFS,
  MIN_WALLPAPERS_PER_COLOR,
  getColorBySlug,
  wallpapersForColor,
} from '@/lib/colors'
import { paginate } from '@/lib/pagination'
import ColorListing from '@/components/ColorListing'

const BASE_URL = 'https://www.wallpaperz.in'

export const revalidate = 3600

export function generateStaticParams() {
  return COLOR_DEFS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const color = getColorBySlug(params.slug)
  if (!color) return {}
  return {
    title: color.seoTitle,
    description: color.seoDescription,
    robots: { index: true, follow: true },
    alternates: { canonical: `/color/${color.slug}` },
    openGraph: {
      title: color.seoTitle,
      description: color.seoDescription,
      url: `${BASE_URL}/color/${color.slug}`,
    },
  }
}

export default async function ColorPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const color = getColorBySlug(params.slug)
  if (!color) notFound()

  const all = await getAllWallpapers()
  const wallpapers = wallpapersForColor(all, color)
  // Thin pages hurt more than they help - only publish colors with real inventory
  if (wallpapers.length < MIN_WALLPAPERS_PER_COLOR) notFound()

  const slice = paginate(wallpapers, 1)
  if (!slice) notFound()

  return <ColorListing color={color} slice={slice} all={all} />
}
