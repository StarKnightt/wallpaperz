import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import {
  COLOR_DEFS,
  MIN_WALLPAPERS_PER_COLOR,
  getColorBySlug,
  wallpapersForColor,
  qualifyingColors,
} from '@/lib/colors'
import ColorPageClient from '@/components/ColorPageClient'

const BASE_URL = 'https://wallpaperz.in'
const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight'

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

  const otherColors = qualifyingColors(all).filter(({ color: c }) => c.slug !== color.slug)

  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${color.name} Wallpapers`,
    description: color.seoDescription,
    url: `${BASE_URL}/color/${color.slug}`,
    hasPart: wallpapers.slice(0, 20).map((w) => ({
      "@type": "ImageObject",
      name: w.title,
      contentUrl: encodeURI(w.imageUrl.startsWith('http') ? w.imageUrl : `${IK}${w.imageUrl}`),
      url: `${BASE_URL}/wallpaper/${w.id}`,
    })),
    provider: { "@type": "Organization", name: "Wallpaperz", url: BASE_URL },
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: `${color.name} Wallpapers`, item: `${BASE_URL}/color/${color.slug}` },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <Link
        href="/"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="mb-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="h-8 w-8 rounded-full border border-border shadow-sm shrink-0"
            style={{ backgroundColor: color.swatch }}
            aria-hidden="true"
          />
          <h1 className="text-3xl md:text-4xl font-bold">{color.name} Wallpapers</h1>
        </div>
        <p className="text-muted-foreground">{color.intro}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {wallpapers.length} free {color.name.toLowerCase()} wallpapers - HD &amp; 4K, no watermarks.
        </p>
      </div>

      <ColorPageClient wallpapers={wallpapers} />

      <div className="mt-12 rounded-xl border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Want a custom {color.name.toLowerCase()} wallpaper?
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Describe your idea and generate a unique {color.name.toLowerCase()}-toned wallpaper with AI in seconds.
          </p>
        </div>
        <Link
          href="/ai-generate"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          Generate with AI
        </Link>
      </div>

      {otherColors.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Browse Wallpapers by Color</h2>
          <div className="flex flex-wrap gap-3">
            {otherColors.map(({ color: c, count }) => (
              <Link
                key={c.slug}
                href={`/color/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-border"
                  style={{ backgroundColor: c.swatch }}
                  aria-hidden="true"
                />
                {c.name}
                <span className="text-muted-foreground">({count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
