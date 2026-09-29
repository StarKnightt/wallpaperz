import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import PackMosaic from "@/components/packs/PackMosaic"
import {
  MEGA_PACK,
  PACKS,
  THEMED_PACKS,
  THEMED_PACKS_TOTAL_USD,
  formatUsd,
  packHref,
  packThumb,
} from "@/lib/packs"

const BASE_URL = "https://www.wallpaperz.in"
const TITLE = "Aesthetic Wallpaper Packs — Phone, Desktop & iPad Bundles"
const DESCRIPTION =
  "Curated wallpaper packs with every design pre-cropped for iPhone, Android, iPad and 1080p to 4K desktops, in one download. Every wallpaper on Wallpaperz stays free."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/packs" },
  openGraph: {
    title: `${TITLE} | Wallpaperz`,
    description: DESCRIPTION,
    url: `${BASE_URL}/packs`,
    siteName: "Wallpaperz",
    type: "website",
    images: [{ url: packThumb(MEGA_PACK.covers[0], 1200), alt: "Wallpaperz wallpaper packs" }],
  },
}

const DEVICES_LABEL = "Phone · Desktop · iPad"

export default function PacksPage() {
  const savePct = Math.round((1 - MEGA_PACK.priceUsd / THEMED_PACKS_TOTAL_USD) * 100)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Wallpaper Packs",
    description: DESCRIPTION,
    url: `${BASE_URL}/packs`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PACKS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `${p.name} Wallpaper Pack`,
          description: p.tagline,
          image: p.covers.map((f) => packThumb(f, 1200)),
          url: p.gumroadUrl,
          brand: { "@type": "Brand", name: "Wallpaperz" },
          offers: {
            "@type": "Offer",
            price: p.priceUsd.toFixed(2),
            priceCurrency: "USD",
            url: p.gumroadUrl,
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto max-w-6xl px-4 pb-20 pt-10 sm:pt-14">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Wallpaper Packs</p>
          <h1 className="mt-4 text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.035em] text-foreground sm:text-5xl">
            Curated sets, every size
            <span className="block text-muted-foreground">in one download.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Every wallpaper on Wallpaperz stays free. Packs are curated sets with every device size in one download.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {["iPhone, Android & iPad sizes", "1080p, 1440p & 4K desktop", "Instant download via Gumroad"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </header>

        <section aria-label="Wallpaper packs" className="mt-12">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <li className="sm:col-span-2">
              <a
                href={packHref(MEGA_PACK, "packs-page")}
                target="_blank"
                rel="noopener"
                className="group grid h-full gap-5 rounded-2xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 md:grid-cols-2 md:gap-6"
              >
                <PackMosaic covers={MEGA_PACK.covers} name={MEGA_PACK.name} variant="strip" />
                <div className="flex flex-col px-1.5 pb-1.5 md:py-3 md:pr-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                    Best value · all 7 packs
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{MEGA_PACK.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">{MEGA_PACK.tagline}</p>
                  <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
                    {MEGA_PACK.count} wallpapers · {MEGA_PACK.fileCount} files · {DEVICES_LABEL}
                  </p>
                  <div className="mt-auto pt-6">
                    <p className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-3xl font-semibold tabular-nums">{formatUsd(MEGA_PACK.priceUsd)}</span>
                      <span className="text-sm text-muted-foreground">
                        <s className="tabular-nums">{formatUsd(THEMED_PACKS_TOTAL_USD)}</s> separately · save {savePct}%
                      </span>
                    </p>
                    <span className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity group-hover:opacity-90">
                      Get the bundle
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
              </a>
            </li>
            {THEMED_PACKS.map((p) => (
              <li key={p.slug}>
                <a
                  href={packHref(p, "packs-page")}
                  target="_blank"
                  rel="noopener"
                  className="group flex h-full flex-col rounded-2xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <PackMosaic covers={p.covers} name={p.name} />
                  <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-4">
                    <h2 className="font-semibold tracking-tight">{p.name}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.tagline}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {p.count} wallpapers · {DEVICES_LABEL}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-lg font-semibold tabular-nums">{formatUsd(p.priceUsd)}</span>
                      <span className="inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors group-hover:border-foreground/40">
                        Get the pack
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-16 max-w-2xl text-center text-sm text-muted-foreground">
          <p>
            Packs are optional. Each design is also a free download on its own wallpaper page, and buying a pack helps
            keep the library free. Files are for personal use; see the{" "}
            <Link href="/license" className="font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400">
              wallpaper license
            </Link>
            . Portrait designs ship in phone and iPad portrait sizes, landscape designs in desktop and iPad landscape sizes.
          </p>
          <p className="mt-4">
            <Link href="/" className="font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400">
              Browse free wallpapers &rarr;
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
