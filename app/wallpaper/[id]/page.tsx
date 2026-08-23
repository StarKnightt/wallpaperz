import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWallpaperById, getRelatedWallpapers } from '@/lib/server/wallpapers'
import { getResolutionName, formatFileSize } from '@/lib/blur-placeholder'
import WallpaperPageClient from './WallpaperPageClient'

// ISR: pages render on first request, then serve from cache for an hour.
// An empty generateStaticParams opts the route into static generation without
// hitting ImageKit at build time (it was fully dynamic before).
export const revalidate = 3600

export function generateStaticParams() {
  return []
}

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wallpaper = await getWallpaperById(params.id)
  if (!wallpaper) return { title: 'Wallpaper Not Found' }

  const resolution = wallpaper.width && wallpaper.height
    ? getResolutionName(wallpaper.width, wallpaper.height)
    : 'HD'
  const dims = wallpaper.width && wallpaper.height
    ? `${wallpaper.width}x${wallpaper.height}`
    : ''

  const title = `${wallpaper.title} - Free ${resolution} ${wallpaper.category} Wallpaper`
  const description = `Download ${wallpaper.title} in ${resolution}${dims ? ` (${dims})` : ''} for free. ${wallpaper.description}`
  const imageUrl = wallpaper.imageUrl.startsWith('http')
    ? wallpaper.imageUrl
    : `${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}${wallpaper.imageUrl}`

  return {
    title,
    description,
    keywords: [
      `${wallpaper.title} wallpaper`,
      `${wallpaper.category} wallpaper`,
      `${resolution} wallpaper`,
      `free ${wallpaper.category.toLowerCase()} wallpaper`,
      'HD wallpaper download',
      '4K wallpaper',
    ],
    openGraph: {
      title,
      description,
      url: `https://wallpaperz.in/wallpaper/${params.id}`,
      siteName: 'Wallpaperz',
      images: [{ url: imageUrl, width: wallpaper.width, height: wallpaper.height, alt: wallpaper.title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/wallpaper/${params.id}`,
    },
  }
}

export default async function WallpaperPage({ params }: Props) {
  const wallpaper = await getWallpaperById(params.id)
  if (!wallpaper) notFound()

  const related = await getRelatedWallpapers(wallpaper, 6)

  const resolution = wallpaper.width && wallpaper.height
    ? getResolutionName(wallpaper.width, wallpaper.height)
    : null
  const imageUrl = wallpaper.imageUrl.startsWith('http')
    ? wallpaper.imageUrl
    : `${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}${wallpaper.imageUrl}`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: wallpaper.title,
    description: wallpaper.description,
    contentUrl: imageUrl,
    thumbnailUrl: imageUrl,
    ...(wallpaper.width && { width: { "@type": "QuantitativeValue", value: wallpaper.width } }),
    ...(wallpaper.height && { height: { "@type": "QuantitativeValue", value: wallpaper.height } }),
    encodingFormat: "image/jpeg",
    isAccessibleForFree: true,
    license: "https://wallpaperz.in/license",
    acquireLicensePage: `https://wallpaperz.in/wallpaper/${wallpaper.id}`,
    creditText: "Wallpaperz",
    copyrightNotice: "Wallpaperz",
    creator: { "@type": "Organization", name: "Wallpaperz", url: "https://wallpaperz.in" },
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://wallpaperz.in" },
      { "@type": "ListItem", position: 2, name: `${wallpaper.category} Wallpapers`, item: `https://wallpaperz.in/category/${wallpaper.category.toLowerCase()}` },
      { "@type": "ListItem", position: 3, name: wallpaper.title, item: `https://wallpaperz.in/wallpaper/${wallpaper.id}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <span className="mx-2">/</span>
          <a href={`/category/${wallpaper.category.toLowerCase()}`} className="hover:text-foreground">
            {wallpaper.category}
          </a>
          <span className="mx-2">/</span>
          <span className="text-foreground">{wallpaper.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WallpaperPageClient wallpaper={wallpaper} imageUrl={imageUrl} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{wallpaper.title}</h1>
              <p className="text-muted-foreground">{wallpaper.description}</p>
            </div>

            <div className="border rounded-lg p-4 space-y-3 text-sm">
              <h2 className="font-semibold text-base">Details</h2>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Category</span>
                <a href={`/category/${wallpaper.category.toLowerCase()}`} className="font-medium hover:text-primary">
                  {wallpaper.category}
                </a>
                {resolution && (
                  <>
                    <span className="text-muted-foreground">Quality</span>
                    <span className="font-medium">{resolution}</span>
                  </>
                )}
                {wallpaper.width && wallpaper.height && (
                  <>
                    <span className="text-muted-foreground">Resolution</span>
                    <span className="font-medium">{wallpaper.width} x {wallpaper.height}</span>
                  </>
                )}
                {wallpaper.fileSize && (
                  <>
                    <span className="text-muted-foreground">File Size</span>
                    <span className="font-medium">{formatFileSize(wallpaper.fileSize)}</span>
                  </>
                )}
                {wallpaper.source && wallpaper.source !== 'imagekit' && (
                  <>
                    <span className="text-muted-foreground">Source</span>
                    <span className="font-medium capitalize">{wallpaper.source}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-6">More {wallpaper.category} Wallpapers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {related.map((w) => {
                const relBase = w.imageUrl.startsWith('http')
                  ? w.imageUrl
                  : `${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}${w.imageUrl}`
                // Thumbnail via ImageKit transform instead of full-res original
                const relUrl = `${relBase}?tr=w-480,q-70,f-auto`
                const relPortrait = !!(w.width && w.height && w.height > w.width)
                return (
                  <a key={w.id} href={`/wallpaper/${w.id}`} className="group block rounded-lg overflow-hidden border">
                    <div className={`${relPortrait ? 'aspect-[9/14]' : 'aspect-[16/10]'} relative`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={relUrl}
                        alt={`${w.title} - ${w.category} wallpaper`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium truncate">{w.title}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
