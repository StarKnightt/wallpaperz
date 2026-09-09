import type { Metadata } from 'next'
import { Wallpaper } from '@/types/wallpaper'
import { pageHref } from '@/lib/pagination'

const BASE_URL = 'https://wallpaperz.in'

// Category landing-page definitions shared by /category/[slug], its paginated
// child route, the homepage chips and the sitemap.
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  abstract: "Discover stunning abstract wallpapers featuring geometric patterns, vibrant colors, and modern artistic designs. Perfect for adding a contemporary touch to your desktop or mobile device.",
  anime: "Browse our collection of high-quality anime wallpapers featuring your favorite characters, epic scenes, and stunning artwork from popular anime series.",
  art: "Explore beautiful artistic wallpapers showcasing paintings, illustrations, and creative masterpieces from talented artists around the world.",
  cars: "Rev up your screens with amazing car wallpapers featuring supercars, classic vehicles, racing scenes, and automotive photography.",
  city: "Experience urban beauty with our city wallpapers showcasing skylines, architecture, streets, and metropolitan landscapes from around the globe.",
  fantasy: "Immerse yourself in magical realms with fantasy wallpapers featuring dragons, mythical creatures, enchanted forests, and otherworldly scenes.",
  gaming: "Level up your screen with gaming wallpapers featuring iconic characters, epic scenes, and artwork from the biggest video game titles.",
  nature: "Bring the outdoors inside with breathtaking nature wallpapers featuring landscapes, mountains, forests, oceans, and wildlife photography.",
  people: "Stunning portrait wallpapers featuring celebrities, K-pop idols, and beautiful photography in HD and 4K quality.",
  space: "Explore the cosmos with stunning space wallpapers featuring planets, galaxies, nebulas, and astronomical wonders captured by NASA and space enthusiasts.",
  technology: "Embrace the digital age with tech-themed wallpapers featuring futuristic designs, circuit boards, coding, and technological innovation.",
  minimalist: "Keep it simple with minimalist wallpapers featuring clean designs, subtle colors, and elegant simplicity for a clutter-free aesthetic.",
  mobile: "Vertical 9:16 phone wallpapers sized perfectly for your mobile screen. HD and 4K portrait backgrounds for iPhone and Android.",
  '4k': "Experience ultra-high definition with our premium 4K wallpapers delivering crystal-clear detail and stunning visual quality.",
  other: "Discover unique wallpapers that don't fit traditional categories, featuring diverse themes and creative concepts."
}

export const CATEGORY_SLUGS = Object.keys(CATEGORY_DESCRIPTIONS)

export function categoryNameFromSlug(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

export function categoryDescription(slug: string): string {
  return (
    CATEGORY_DESCRIPTIONS[slug.toLowerCase()] ||
    `Browse our collection of high-quality ${categoryNameFromSlug(slug)} wallpapers for desktop and mobile devices.`
  )
}

/** Metadata for /category/[slug] (page 1) and /category/[slug]/page/[n]. */
export function categoryMetadata(slug: string, page = 1): Metadata {
  const category = categoryNameFromSlug(slug)
  const description = categoryDescription(slug)
  const basePath = `/category/${slug}`
  const suffix = page > 1 ? ` – Page ${page}` : ''
  // Root layout template appends "| Wallpaperz"
  const title = `${category} Wallpapers - Free HD & 4K Downloads${suffix}`
  return {
    title,
    description: page > 1 ? `Page ${page}: ${description}` : description,
    keywords: [
      `${category} wallpapers`,
      `${category} backgrounds`,
      `HD ${category} wallpapers`,
      `4K ${category} wallpapers`,
      `free ${category} wallpapers`,
      `${category} desktop wallpapers`,
      `${category} mobile wallpapers`,
    ],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${pageHref(basePath, page)}`,
      siteName: 'Wallpaperz',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: pageHref(basePath, page),
    },
  }
}

/** Distinct category names present in the library, alphabetical (chip row). */
export function categoryNamesOf(all: Wallpaper[]): string[] {
  return Array.from(new Set(all.map((w) => w.category))).sort()
}

/** "mobile" is an orientation pseudo-category: any portrait wallpaper qualifies. */
export function wallpapersForCategory(all: Wallpaper[], slug: string): Wallpaper[] {
  const key = slug.toLowerCase()
  if (key === 'mobile') return all.filter((w) => (w.height ?? 0) > (w.width ?? 0))
  return all.filter((w) => w.category.toLowerCase() === key)
}
