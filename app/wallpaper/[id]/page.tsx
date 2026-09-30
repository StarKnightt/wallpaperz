import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getAllWallpapersDaily, getWallpaperById, getRelatedWallpapers, getHomePageNumberFor, isAiGenerated } from '@/lib/server/wallpapers'
import { pageHref } from '@/lib/pagination'
import { getResolutionName, formatFileSize } from '@/lib/blur-placeholder'
import { idFromSegment, wallpaperPath, wallpaperSegment } from '@/lib/wallpaper-url'
import { devicesForWallpaper, deviceDownloadUrl } from '@/lib/devices'
import WallpaperPageClient from './WallpaperPageClient'
import CreditSnippet from '@/components/CreditSnippet'
import { ArrowUpRight } from 'lucide-react'
import { formatUsd, packForWallpaper, packHref, packThumb } from '@/lib/packs'

// ISR with full build-time prerendering: every wallpaper page is generated at
// build (one ImageKit list call, same as the sitemaps) so no visitor request
// ever pays a fresh SSR render — critical on the Workers free plan (10ms CPU).
// New IDs uploaded after a build still render on demand (dynamicParams default).
// Daily, not hourly: every stale hit triggers a background re-render that runs
// past the 10ms CPU cap (exceededCpu) and can 503 the visitor's request, and
// these long-tail pages are almost always stale when visited.
export const revalidate = 86400

function clampDescription(text: string, max = 160): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:-]+$/, '')}…`
}

export async function generateStaticParams() {
  const wallpapers = await getAllWallpapersDaily()
  return wallpapers.map((w) => ({ id: wallpaperSegment(w) }))
}

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const wallpaper = await getWallpaperById(idFromSegment(params.id))
  if (!wallpaper) return { title: 'Wallpaper Not Found' }
  const path = wallpaperPath(wallpaper)

  const resolution = wallpaper.width && wallpaper.height
    ? getResolutionName(wallpaper.width, wallpaper.height)
    : 'HD'
  const dims = wallpaper.width && wallpaper.height
    ? `${wallpaper.width}x${wallpaper.height}`
    : ''

  const title = `${wallpaper.title} - Free ${resolution} ${wallpaper.category} Wallpaper`
  const description = clampDescription(`Download ${wallpaper.title} in ${resolution}${dims ? ` (${dims})` : ''} for free. ${wallpaper.description}`)
  const originalUrl = wallpaper.imageUrl.startsWith('http')
    ? wallpaper.imageUrl
    : `${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}${wallpaper.imageUrl}`
  // ImageKit ignores ?tr= when the URL already carries a query (e.g. ?updatedAt=).
  const imageUrl = `${originalUrl.split('?')[0]}?tr=w-1200,q-80`
  const ogWidth = Math.min(1200, wallpaper.width || 1200)
  const ogHeight = wallpaper.width && wallpaper.height ? Math.round((ogWidth * wallpaper.height) / wallpaper.width) : undefined

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
      url: `https://www.wallpaperz.in${path}`,
      siteName: 'Wallpaperz',
      images: [{ url: imageUrl, width: ogWidth, height: ogHeight, alt: wallpaper.title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: path,
    },
  }
}

export default async function WallpaperPage(props: Props) {
  const params = await props.params;
  const wallpaper = await getWallpaperById(idFromSegment(params.id))
  if (!wallpaper) notFound()
  // Legacy /wallpaper/<id> links (Pinterest pins, old index entries) and
  // renamed titles all collapse onto one canonical URL.
  if (decodeURIComponent(params.id) !== wallpaperSegment(wallpaper)) permanentRedirect(wallpaperPath(wallpaper))
  const pageUrl = `https://www.wallpaperz.in${wallpaperPath(wallpaper)}`
  const fitDevices = devicesForWallpaper(wallpaper)

  const related = await getRelatedWallpapers(wallpaper, 6)
  // Homepage list page this wallpaper appears on - links deep list pages from
  // every detail page so crawlers discover /page/N beyond the sitemap.
  const homePage = await getHomePageNumberFor(wallpaper.id)

  const resolution = wallpaper.width && wallpaper.height
    ? getResolutionName(wallpaper.width, wallpaper.height)
    : null
  const imageUrl = wallpaper.imageUrl.startsWith('http')
    ? wallpaper.imageUrl
    : `${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}${wallpaper.imageUrl}`
  const aiGenerated = isAiGenerated(wallpaper)
  const pack = packForWallpaper(wallpaper.imageUrl, wallpaper.category)

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
    license: "https://www.wallpaperz.in/license",
    acquireLicensePage: pageUrl,
    creditText: aiGenerated ? "Wallpaperz (created with AI)" : "Wallpaperz",
    copyrightNotice: "Wallpaperz",
    creator: { "@type": "Organization", name: "Wallpaperz", url: "https://www.wallpaperz.in" },
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wallpaperz.in" },
      { "@type": "ListItem", position: 2, name: `${wallpaper.category} Wallpapers`, item: `https://www.wallpaperz.in/category/${wallpaper.category.toLowerCase()}` },
      { "@type": "ListItem", position: 3, name: wallpaper.title, item: pageUrl },
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
                {aiGenerated && (
                  <>
                    <span className="text-muted-foreground">Origin</span>
                    <a href="/ai-transparency" className="font-medium hover:text-primary">
                      Created with AI
                    </a>
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

            {fitDevices.length > 0 && (
              <div className="border rounded-lg p-4 text-sm">
                <h2 className="font-semibold text-base">Download for your device</h2>
                <p className="mt-1 mb-3 text-muted-foreground">Cropped to your exact screen resolution, so it fills edge to edge.</p>
                <ul className="divide-y">
                  {fitDevices.map((d) => (
                    <li key={d.slug} className="flex items-center justify-between gap-3 py-2">
                      <a href={`/devices/${d.slug}`} className="min-w-0 hover:text-primary">
                        <span className="block truncate font-medium">{d.name}</span>
                        <span className="block text-xs text-muted-foreground tabular-nums">{d.width} × {d.height}</span>
                      </a>
                      <a
                        href={deviceDownloadUrl(wallpaper, d)}
                        rel="nofollow"
                        className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary"
                        aria-label={`Download ${wallpaper.title} for ${d.name} at ${d.width} by ${d.height}`}
                      >
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
                <a href="/devices" className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
                  All devices and sizes &rarr;
                </a>
              </div>
            )}

            {pack && (
              <a
                href={packHref(pack, 'wallpaper-page')}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:border-foreground/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={packThumb(pack.covers[0], 160)}
                  alt=""
                  loading="lazy"
                  className="h-11 w-11 shrink-0 rounded-md object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">Part of the {pack.name} pack</span>
                  <span className="block text-xs text-muted-foreground">
                    {pack.count} wallpapers · phone, iPad &amp; desktop
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
                  {formatUsd(pack.priceUsd)}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </a>
            )}

            <CreditSnippet title={wallpaper.title} pageUrl={pageUrl} imageUrl={imageUrl} />
            
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
              <h2 className="text-xl font-bold">More {wallpaper.category} Wallpapers</h2>
              <p className="text-sm text-muted-foreground">
                <a href={`/category/${wallpaper.category.toLowerCase()}`} className="text-primary hover:underline">
                  All {wallpaper.category.toLowerCase()} wallpapers
                </a>
                {homePage && (
                  <>
                    <span className="mx-2">&middot;</span>
                    <a href={pageHref('/', homePage)} className="text-primary hover:underline">
                      Browse all wallpapers{homePage > 1 ? ` (page ${homePage})` : ''}
                    </a>
                  </>
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {related.map((w) => {
                const relBase = w.imageUrl.startsWith('http')
                  ? w.imageUrl
                  : `${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}${w.imageUrl}`
                // Thumbnail via ImageKit transform instead of full-res original
                const relUrl = `${relBase}?tr=w-480,q-70,f-auto`
                const relPortrait = !!(w.width && w.height && w.height > w.width)
                return (
                  <a key={w.id} href={wallpaperPath(w)} className="group block rounded-lg overflow-hidden border">
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
