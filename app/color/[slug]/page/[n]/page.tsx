import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import {
  MIN_WALLPAPERS_PER_COLOR,
  getColorBySlug,
  qualifyingColors,
  wallpapersForColor,
} from '@/lib/colors'
import { extraPageParams, pageHref, paginate, parsePageParam } from '@/lib/pagination'
import ColorListing from '@/components/ColorListing'

const BASE_URL = 'https://www.wallpaperz.in'

export const revalidate = 3600

// Every (color, page>=2) pair for colors that meet the inventory threshold,
// so all list pages are prerendered at build time.
export async function generateStaticParams() {
  const all = await getAllWallpapers()
  return qualifyingColors(all).flatMap(({ color, count }) =>
    extraPageParams(count).map(({ n }) => ({ slug: color.slug, n }))
  )
}

type Props = { params: Promise<{ slug: string; n: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, n } = await props.params
  const color = getColorBySlug(slug)
  const page = parsePageParam(n)
  if (!color || !Number.isFinite(page) || page < 2) return {}
  const basePath = `/color/${color.slug}`
  const title = `${color.seoTitle} – Page ${page}`
  return {
    title,
    description: `Page ${page}: ${color.seoDescription}`,
    robots: { index: true, follow: true },
    alternates: { canonical: pageHref(basePath, page) },
    openGraph: {
      title,
      description: color.seoDescription,
      url: `${BASE_URL}${pageHref(basePath, page)}`,
    },
  }
}

export default async function ColorPageN(props: Props) {
  const { slug, n } = await props.params
  const color = getColorBySlug(slug)
  if (!color) notFound()
  const page = parsePageParam(n)
  if (page === 1) permanentRedirect(`/color/${color.slug}`)
  if (!Number.isFinite(page)) notFound()

  const all = await getAllWallpapers()
  const wallpapers = wallpapersForColor(all, color)
  if (wallpapers.length < MIN_WALLPAPERS_PER_COLOR) notFound()

  const slice = paginate(wallpapers, page)
  if (!slice) notFound()

  return <ColorListing color={color} slice={slice} all={all} />
}
