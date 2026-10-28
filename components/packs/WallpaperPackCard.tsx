import { ArrowUpRight } from "lucide-react"
import PackMosaic from "@/components/packs/PackMosaic"
import { MEGA_PACK, THEMED_PACKS, fileNameOf, formatUsd, packForCategory, packForWallpaper, packHref } from "@/lib/packs"

interface Props {
  imageUrl: string
  category: string
}

// Gumroad pack promo for a wallpaper page: the pack containing this wallpaper,
// else its category's pack, else the Mega Bundle. Our own product, so it is
// shown to every plan; keep it far from the Download button.
export default function WallpaperPackCard({ imageUrl, category }: Props) {
  const member = packForWallpaper(imageUrl, category)
  const pack = member ?? packForCategory(category) ?? MEGA_PACK
  const isBundle = pack === MEGA_PACK
  const file = fileNameOf(imageUrl)
  const covers = member ? [file, ...pack.covers.filter((c) => c !== file)] : pack.covers

  const heading = member
    ? `This wallpaper is part of the ${pack.name} pack`
    : isBundle
      ? `Like this? Get the ${pack.name}`
      : `Like this? Get the full ${pack.name} pack`
  const detail = isBundle
    ? `All ${THEMED_PACKS.length} collections, ${pack.count} wallpapers pre-cropped for every device`
    : `${pack.count} wallpapers pre-cropped for every device`

  return (
    <section aria-label="Wallpaper pack" className="mt-12">
      <a
        href={packHref(pack, "wallpaper-page")}
        target="_blank"
        rel="noopener"
        className="group grid gap-4 rounded-2xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-center sm:gap-6"
      >
        <PackMosaic covers={covers} name={pack.name} />
        <div className="flex flex-col px-1.5 pb-1.5 sm:py-2 sm:pr-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
            Wallpaper pack
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">{heading}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {detail} · {pack.fileCount} files for iPhone, Android, iPad &amp; desktop in one download.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="text-2xl font-semibold tabular-nums">{formatUsd(pack.priceUsd)}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity group-hover:opacity-90">
              Get the pack
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </a>
    </section>
  )
}
