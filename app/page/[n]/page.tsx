import { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import HomeClient from "@/app/HomeClient"
import HomeSeoSections from "@/components/HomeSeoSections"
import PaginationHead from "@/components/PaginationHead"
import { getAllWallpapers } from "@/lib/server/wallpapers"
import { extraPageParams, pageHref, paginate, parsePageParam } from "@/lib/pagination"
import { categoryNamesOf } from "@/lib/category-pages"

const BASE_URL = "https://wallpaperz.in"

// Every list page is prerendered at build (Workers free plan: no SSR budget).
// A page that only becomes valid after new uploads renders on demand once
// (dynamicParams default) and is then cached like the rest.
export const revalidate = 3600

export async function generateStaticParams() {
  const all = await getAllWallpapers()
  return extraPageParams(all.length)
}

type Props = { params: Promise<{ n: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { n } = await props.params
  const page = parsePageParam(n)
  if (!Number.isFinite(page) || page < 2) return {}
  const title = `Free 4K Wallpapers – Page ${page}`
  const description = `Page ${page} of our free HD & 4K wallpaper library. Browse desktop and phone backgrounds, newest first, and download in original quality.`
  return {
    title,
    description,
    alternates: { canonical: pageHref("/", page) },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | Wallpaperz`,
      description,
      url: `${BASE_URL}${pageHref("/", page)}`,
      siteName: "Wallpaperz",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${title} | Wallpaperz`, description },
  }
}

export default async function HomePageN(props: Props) {
  const { n } = await props.params
  const page = parsePageParam(n)
  if (page === 1) permanentRedirect("/")
  if (!Number.isFinite(page)) notFound()

  const all = await getAllWallpapers()
  const slice = paginate(all, page)
  if (!slice) notFound()
  const categories = categoryNamesOf(all)

  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Free HD & 4K Wallpapers – Page ${page}`,
    url: `${BASE_URL}${pageHref("/", page)}`,
    isPartOf: { "@type": "WebSite", name: "Wallpaperz", url: BASE_URL },
    provider: { "@type": "Organization", name: "Wallpaperz", url: BASE_URL },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }}
      />
      <PaginationHead currentPage={page} totalPages={slice.totalPages} basePath="/" />

      <HomeClient
        wallpapers={slice.items}
        page={page}
        totalPages={slice.totalPages}
        total={slice.total}
        categories={categories}
        showHero={false}
      />

      <HomeSeoSections />
    </>
  )
}
