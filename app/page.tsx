import HomeClient from "./HomeClient"
import HomeSeoSections from "@/components/HomeSeoSections"
import PaginationHead from "@/components/PaginationHead"
import { getAllWallpapers } from "@/lib/server/wallpapers"
import { paginate } from "@/lib/pagination"
import { categoryNamesOf } from "@/lib/category-pages"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Wallpaperz",
  url: "https://www.wallpaperz.in",
  description: "Browse and download free HD & 4K wallpapers for desktop and mobile. Generate custom wallpapers with AI.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.wallpaperz.in/?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

const collectionData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free HD & 4K Wallpapers",
  description: "Curated collection of high-resolution wallpapers across categories like nature, anime, space, minimalist, and more.",
  url: "https://www.wallpaperz.in",
  provider: {
    "@type": "Organization",
    name: "Wallpaperz",
    url: "https://www.wallpaperz.in",
  },
}

// Page 1 of the paginated library; pages 2..N live at /page/[n]. The grid
// slice is server-rendered so the first 24 wallpapers are in the HTML.
export default async function Page() {
  const all = await getAllWallpapers()
  const categories = categoryNamesOf(all)
  const slice = paginate(all, 1) ?? { items: [], page: 1, totalPages: 1, total: 0 }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }}
      />
      <PaginationHead currentPage={1} totalPages={slice.totalPages} basePath="/" />

      <HomeClient
        wallpapers={slice.items}
        page={1}
        totalPages={slice.totalPages}
        total={slice.total}
        categories={categories}
        showHero
      />

      <HomeSeoSections />
    </>
  )
}
