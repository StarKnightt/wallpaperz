import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Wallpaper } from "@/types/wallpaper"
import { PageSlice, pageHref } from "@/lib/pagination"
import { categoryNameFromSlug, categoryNamesOf } from "@/lib/category-pages"
import WallpaperListingClient from "@/components/WallpaperListingClient"
import Pagination from "@/components/Pagination"
import PaginationHead from "@/components/PaginationHead"
import CategoryChips from "@/components/CategoryChips"
import { Button } from "@/components/ui/button"
import { wallpaperPath } from "@/lib/wallpaper-url"
import { formatUsd, packForCategory, packHref, packThumb } from "@/lib/packs"

const BASE_URL = "https://www.wallpaperz.in"
const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || "https://ik.imagekit.io/starknight"

interface Props {
  slug: string
  slice: PageSlice<Wallpaper>
  /** Whole library, for the category chip row */
  all: Wallpaper[]
}

// Server-rendered category page body shared by /category/[slug] and
// /category/[slug]/page/[n]; the grid slice is in the HTML for crawlers.
export default function CategoryListing({ slug, slice, all }: Props) {
  const category = categoryNameFromSlug(slug)
  const basePath = `/category/${slug}`
  const { items, page, totalPages, total } = slice
  // Redundant on /category/mobile, which is already an orientation pseudo-category
  const showDeviceFilter = slug.toLowerCase() !== "mobile"
  const pack = packForCategory(slug)

  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} Wallpapers${page > 1 ? ` – Page ${page}` : ""}`,
    url: `${BASE_URL}${pageHref(basePath, page)}`,
    hasPart: items.slice(0, 20).map((w) => ({
      "@type": "ImageObject",
      name: w.title,
      contentUrl: encodeURI(w.imageUrl.startsWith("http") ? w.imageUrl : `${IK}${w.imageUrl}`),
      url: `${BASE_URL}${wallpaperPath(w)}`,
    })),
    provider: { "@type": "Organization", name: "Wallpaperz", url: BASE_URL },
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: `${category} Wallpapers`, item: `${BASE_URL}${basePath}` },
      ...(page > 1
        ? [{ "@type": "ListItem", position: 3, name: `Page ${page}`, item: `${BASE_URL}${pageHref(basePath, page)}` }]
        : []),
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <PaginationHead currentPage={page} totalPages={totalPages} basePath={basePath} />

      <Link
        href="/"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {category} Wallpapers
          {page > 1 && <span className="text-muted-foreground font-normal"> &mdash; Page {page}</span>}
        </h1>
        <p className="text-muted-foreground">
          Explore our collection of high-quality {category.toLowerCase()} wallpapers ({total} wallpapers
          {totalPages > 1 ? `, page ${page} of ${totalPages}` : ""})
        </p>
      </div>

      <CategoryChips categories={categoryNamesOf(all)} activeSlug={slug.toLowerCase()} className="mb-6" />

      {pack && total > 0 && (
        <a
          href={packHref(pack, "category-banner")}
          target="_blank"
          rel="noopener"
          className="group mb-6 flex items-center gap-2.5 rounded-full border bg-card/60 py-1.5 pl-1.5 pr-4 text-sm transition-colors hover:border-foreground/30 sm:w-fit"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={packThumb(pack.covers[0], 96)} alt="" loading="lazy" className="h-7 w-7 shrink-0 rounded-full object-cover" />
          <span className="min-w-0 flex-1 truncate">
            <span className="font-medium">{pack.name} pack</span>
            <span className="text-muted-foreground">
              <span className="hidden sm:inline"> · {pack.count} wallpapers for phone, iPad &amp; desktop</span> · {formatUsd(pack.priceUsd)}
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden />
        </a>
      )}

      {total === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">No wallpapers found in this category yet.</p>
          <Button asChild>
            <Link href="/">Browse All Wallpapers</Link>
          </Button>
        </div>
      ) : (
        <>
          <WallpaperListingClient wallpapers={items} showDeviceFilter={showDeviceFilter} />
          <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} className="mt-10" />
        </>
      )}
    </div>
  )
}
