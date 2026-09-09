import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import { extraPageParams, paginate, parsePageParam } from '@/lib/pagination'
import { CATEGORY_SLUGS, categoryMetadata, wallpapersForCategory } from '@/lib/category-pages'
import CategoryListing from '@/components/CategoryListing'

export const revalidate = 3600

// Enumerate every (category, page>=2) pair from the cached library so all
// list pages are prerendered - no request-time SSR on the Workers free plan.
export async function generateStaticParams() {
  const all = await getAllWallpapers()
  return CATEGORY_SLUGS.flatMap((slug) =>
    extraPageParams(wallpapersForCategory(all, slug).length).map(({ n }) => ({ slug, n }))
  )
}

type Props = { params: Promise<{ slug: string; n: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, n } = await props.params
  const page = parsePageParam(n)
  if (!Number.isFinite(page) || page < 2) return {}
  return categoryMetadata(slug, page)
}

export default async function CategoryPageN(props: Props) {
  const { slug, n } = await props.params
  const page = parsePageParam(n)
  if (page === 1) permanentRedirect(`/category/${slug}`)
  if (!Number.isFinite(page)) notFound()

  const all = await getAllWallpapers()
  const slice = paginate(wallpapersForCategory(all, slug), page)
  if (!slice) notFound()

  return <CategoryListing slug={slug} slice={slice} all={all} />
}
