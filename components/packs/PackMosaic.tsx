import { cn } from "@/lib/utils"
import { packThumb } from "@/lib/packs"

interface Props {
  covers: string[]
  name: string
  /** "grid": hero tile + two stacked tiles. "strip": four tall tiles side by side. */
  variant?: "grid" | "strip"
  className?: string
}

export default function PackMosaic({ covers, name, variant = "grid", className }: Props) {
  const tile = "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"

  if (variant === "strip") {
    return (
      <div className={cn("grid grid-cols-4 gap-1.5", className)}>
        {covers.slice(0, 4).map((file) => (
          <div key={file} className="aspect-[9/16] overflow-hidden rounded-xl bg-muted md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={packThumb(file, 400)} alt="" loading="lazy" decoding="async" className={tile} />
          </div>
        ))}
        <span className="sr-only">Preview of the {name}</span>
      </div>
    )
  }

  const [hero, a, b] = covers
  return (
    <div className={cn("grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-1.5", className)}>
      <div className="col-span-2 row-span-2 overflow-hidden rounded-xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={packThumb(hero, 600)} alt={`Preview of the ${name} pack`} loading="lazy" decoding="async" className={tile} />
      </div>
      {[a, b].map((file) => (
        <div key={file} className="overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={packThumb(file, 300)} alt="" loading="lazy" decoding="async" className={tile} />
        </div>
      ))}
    </div>
  )
}
