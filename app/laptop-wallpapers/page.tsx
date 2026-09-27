import { Metadata } from 'next'
import Link from 'next/link'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import { wallpaperPath } from '@/lib/wallpaper-url'
import { getResolutionName } from '@/lib/blur-placeholder'
import { DEVICES } from '@/lib/devices'
import { Wallpaper } from '@/types/wallpaper'

export const revalidate = 3600

const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight'
const BASE_URL = 'https://www.wallpaperz.in'

const landscape = (all: Wallpaper[]) => all.filter((w) => w.width && w.height && w.width > w.height)

export async function generateMetadata(): Promise<Metadata> {
  const count = landscape(await getAllWallpapers()).length
  const title = `4K Laptop Wallpapers - ${count} Free HD Backgrounds for Laptop & PC`
  const description = `${count} free 4K and QHD laptop wallpapers: abstract, space, anime, nature and more. Download the original or a version cropped to your MacBook or monitor.`
  return {
    title,
    description,
    alternates: { canonical: '/laptop-wallpapers' },
    openGraph: { title, description, url: `${BASE_URL}/laptop-wallpapers`, siteName: 'Wallpaperz', type: 'website' },
  }
}

const QUICK = ['macbook-air-13', 'macbook-pro-14', 'macbook-pro-16', '1920x1080', '2560x1440', '3840x2160', '3440x1440']

export default async function LaptopWallpapersPage() {
  const wallpapers = landscape(await getAllWallpapers())
  const fourK = wallpapers.filter((w) => (w.width ?? 0) >= 3840).length

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '4K Laptop Wallpapers',
    url: `${BASE_URL}/laptop-wallpapers`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: wallpapers.length,
      itemListElement: wallpapers.slice(0, 30).map((w, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE_URL}${wallpaperPath(w)}`,
        name: w.title,
      })),
    },
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">4K Laptop Wallpapers</h1>
        <p className="mt-3 text-muted-foreground">
          {wallpapers.length} widescreen wallpapers for laptops and desktop PCs, {fourK} of them in full 4K.
          Every one is free. Grab the original, or get it cropped to your exact screen below.
        </p>
      </header>

      <nav aria-label="Crop to your screen" className="mt-6 flex flex-wrap gap-2">
        {QUICK.map((slug) => {
          const d = DEVICES.find((x) => x.slug === slug)!
          return (
            <Link key={slug} href={`/devices/${slug}`} className="inline-flex items-baseline gap-2 rounded-full border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
              {d.brand === 'Monitor' ? d.name.match(/\((.+)\)/)?.[1] : d.name}
              <span className="text-xs text-muted-foreground tabular-nums">{d.width}×{d.height}</span>
            </Link>
          )
        })}
      </nav>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wallpapers.map((w, i) => {
          const src = w.imageUrl.startsWith('http') ? w.imageUrl : `${IK}${w.imageUrl}`
          const res = w.width && w.height ? getResolutionName(w.width, w.height) : null
          return (
            <li key={w.id}>
              <Link href={wallpaperPath(w)} className="group block overflow-hidden rounded-xl border bg-card">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- ImageKit-sized thumbnail */}
                  <img
                    src={`${src}?tr=w-640,h-360,fo-auto,q-70,f-auto`}
                    alt={`${w.title} - ${res ?? 'HD'} laptop wallpaper`}
                    width={640}
                    height={360}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {res && (
                    <span className="absolute right-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                      {res}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="truncate text-sm font-medium group-hover:text-primary">{w.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{w.width}×{w.height}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-xl font-bold">Picking a laptop wallpaper that stays sharp</h2>
        <p className="mt-3 text-muted-foreground">
          Most laptops made in the last few years have high-density screens: a 13-inch MacBook Air is
          2560 × 1664 and a 16-inch MacBook Pro is 3456 × 2234. A 1080p image stretched onto those looks
          soft, so start with a wallpaper at least as wide as your screen - the 4K ones above cover every
          laptop sold today. Not sure what yours is? The{' '}
          <Link href="/devices" className="text-primary hover:underline">device size finder</Link> detects it for you,
          and the <Link href="/blog/wallpaper-resolution-guide" className="text-primary hover:underline">resolution guide</Link>{' '}
          explains the numbers.
        </p>
      </section>
    </div>
  )
}
