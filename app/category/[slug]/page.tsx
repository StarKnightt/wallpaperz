import { Metadata } from 'next'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import { paginate } from '@/lib/pagination'
import { CATEGORY_SLUGS, categoryMetadata, wallpapersForCategory } from '@/lib/category-pages'
import CategoryListing from '@/components/CategoryListing'

// Prerendered at build (one ImageKit list call shared via unstable_cache) and
// refreshed hourly; pages 2..N live at /category/[slug]/page/[n].
export const revalidate = 3600

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  return categoryMetadata(slug, 1)
}

export default async function CategoryPage(props: Props) {
  const { slug } = await props.params
  const all = await getAllWallpapers()
  const wallpapers = wallpapersForCategory(all, slug)
  // Empty categories still render (they are linked from the sitemap) with an empty state
  const slice = paginate(wallpapers, 1) ?? { items: [], page: 1, totalPages: 1, total: 0 }

  return <CategoryListing slug={slug} slice={slice} all={all} />
}
