"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Laptop, Monitor, ScanLine, Smartphone, Tablet, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DeviceKind, deviceThumbUrl, getDevice } from "@/lib/devices"
import { detectScreen, type ScreenResult } from "@/lib/screen"

type Choice = DeviceKind | "yours"

const FEATURED = {
  imageUrl: "https://ik.imagekit.io/starknight/wallpapers/angel-warrior-anime-girl-sword-4k-wallpaperz.jpg",
  title: "Angel Warrior",
}

const PRESETS: Record<DeviceKind, { slug: string; label: string }> = {
  phone: { slug: "iphone-17-pro-max", label: "iPhone 17 Pro Max" },
  tablet: { slug: "ipad-pro-13", label: "iPad Pro 13-inch" },
  laptop: { slug: "macbook-air-13", label: "MacBook Air 13-inch" },
  desktop: { slug: "3840x2160", label: "4K desktop" },
}

const OPTIONS: { value: Choice; label: string; short?: string; icon: LucideIcon }[] = [
  { value: "phone", label: "Phone", icon: Smartphone },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "yours", label: "Your screen", short: "Yours", icon: ScanLine },
]

// Bezel thickness (px, drawn with box-shadow so it never changes the screen box) and corner shape
const FRAME: Record<DeviceKind, { bezel: number; radius: string }> = {
  phone: { bezel: 6, radius: "17% / 7.8%" },
  tablet: { bezel: 9, radius: "5% / 6.6%" },
  laptop: { bezel: 7, radius: "1.6% / 2.5%" },
  desktop: { bezel: 8, radius: "1% / 1.8%" },
}

interface Target {
  width: number
  height: number
  kind: DeviceKind
  label: string
  slug: string
  note?: string
}

function targetFor(choice: Choice, screen: ScreenResult | null): Target {
  if (choice !== "yours" || !screen) {
    const kind = choice === "yours" ? "phone" : choice
    const d = getDevice(PRESETS[kind].slug)!
    return { width: d.width, height: d.height, kind, label: PRESETS[kind].label, slug: d.slug }
  }
  const match = screen.matches[0] ?? screen.closest
  const portrait = screen.h > screen.w
  return {
    width: screen.w,
    height: screen.h,
    kind: match?.kind ?? (portrait ? "phone" : "desktop"),
    label: "Your screen",
    slug: match?.slug ?? "",
    note: match ? `${screen.matches.length ? "Exact match" : "Closest size"}: ${match.name}` : undefined,
  }
}

function previewSrc(t: Pick<Target, "width" | "height">) {
  return deviceThumbUrl(FEATURED, t, t.height > t.width ? 300 : 600)
}

type Layer = { src: string; loaded: boolean }

/**
 * Homepage explainer for the device pages: the same wallpaper, smart-cropped by
 * ImageKit (w,h,fo-auto) to the selected screen, the exact transform the
 * /devices/[slug] downloads use.
 */
export default function ExactFitPreview() {
  const [choice, setChoice] = useState<Choice>("phone")
  const [screen, setScreen] = useState<ScreenResult | null>(null)
  const [layers, setLayers] = useState<Layer[]>(() => [{ src: previewSrc(targetFor("phone", null)), loaded: true }])

  useEffect(() => {
    setScreen(detectScreen())
  }, [])

  const target = targetFor(choice, screen)
  const src = previewSrc(target)

  // Keep the last fully loaded crop underneath until the new one is ready, then fade it in
  useEffect(() => {
    setLayers((ls) => {
      if (ls[ls.length - 1]?.src === src) return ls
      const settled = ls.filter((l) => l.loaded).slice(-1)
      if (settled[0]?.src === src) return settled
      return [...settled, { src, loaded: false }]
    })
  }, [src])

  const onLoaded = useCallback((loadedSrc: string) => {
    setLayers((ls) => ls.map((l) => (l.src === loadedSrc ? { ...l, loaded: true } : l)))
    window.setTimeout(() => {
      setLayers((ls) => {
        const i = ls.findIndex((l) => l.src === loadedSrc && l.loaded)
        return i > 0 ? ls.slice(i) : ls
      })
    }, 600)
  }, [])

  const preload = (value: Choice) => {
    const next = previewSrc(targetFor(value, screen))
    if (next !== src) new window.Image().src = next
  }

  const ratio = target.width / target.height
  const { bezel, radius } = FRAME[target.kind]
  const href = target.slug ? `/devices/${target.slug}` : "/devices"

  return (
    <section aria-labelledby="exact-fit-heading" className="container mx-auto px-4">
      <div className="flex flex-col gap-3 overflow-hidden rounded-2xl border bg-card/70 p-4 shadow-sm sm:gap-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10 lg:p-8">
        {/* display:contents below lg so the stage can sit between the switcher and the readout */}
        <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-5">
          <div className="space-y-1 sm:space-y-2">
            <p className="hidden text-xs font-semibold uppercase tracking-wider text-primary sm:block">Exact fit</p>
            <h2 id="exact-fit-heading" className="text-lg font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Cropped to fit your exact screen
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              <span className="sm:hidden">Downloads match your screen&apos;s exact pixels. No stretching, no black bars.</span>
              <span className="hidden sm:inline">
                Pick your device and downloads come out at its native resolution, smart-cropped around the
                subject. No stretching, no black bars.
              </span>
            </p>
          </div>

          <div
            role="group"
            aria-label="Preview device"
            className="grid grid-cols-5 gap-0.5 self-start rounded-full border bg-muted/60 p-1 max-sm:w-full sm:inline-flex sm:gap-1"
          >
            {OPTIONS.map(({ value, label, short, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setChoice(value)}
                onPointerEnter={() => preload(value)}
                onFocus={() => preload(value)}
                aria-pressed={choice === value}
                className={cn(
                  "inline-flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-1 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:text-sm",
                  choice === value
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="hidden h-3.5 w-3.5 shrink-0 sm:block" aria-hidden="true" />
                {short ? (
                  <>
                    <span className="min-[400px]:hidden">{short}</span>
                    <span className="hidden min-[400px]:inline">{label}</span>
                  </>
                ) : (
                  label
                )}
              </button>
            ))}
          </div>

          <div className="order-last flex items-center justify-between gap-3 lg:order-none lg:block lg:space-y-5">
            <div className="min-w-0" aria-live="polite">
              <p className="truncate text-base font-semibold tabular-nums sm:text-lg">
                {target.width} × {target.height}
                <span className="hidden font-normal text-muted-foreground sm:inline"> · {target.label}</span>
              </p>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                <span className="sm:hidden">{choice === "yours" ? target.note ?? "Your screen" : target.label}</span>
                <span className="hidden sm:inline">
                  {choice === "yours"
                    ? target.note ?? "Detected from your display"
                    : "Every download on its page is cut to exactly this size"}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <Link
                href={href}
                aria-label={`Browse for your device: ${target.slug ? getDevice(target.slug)?.name : "all devices"} wallpapers`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <span className="sm:hidden">Browse</span>
                <span className="hidden sm:inline">Browse for your device</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/devices" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
                All devices
              </Link>
            </div>
          </div>
        </div>

        {/* Fixed-height stage; the screen box resizes inside it, so nothing around it moves */}
        <div className="relative h-[180px] shrink-0 rounded-xl bg-muted/60 sm:h-[240px] lg:h-[340px]">
          <div className="absolute inset-x-4 bottom-7 top-3 sm:inset-x-8 sm:bottom-11 sm:top-5" style={{ containerType: "size" }}>
            <div className="flex h-full w-full items-center justify-center">
              <div
                className="relative transition-[width,height,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  width: `min(calc(100cqw - ${bezel * 2}px), calc((100cqh - ${bezel * 2}px) * ${ratio}))`,
                  height: `min(calc(100cqh - ${bezel * 2}px), calc((100cqw - ${bezel * 2}px) / ${ratio}))`,
                  borderRadius: radius,
                  boxShadow: `0 0 0 ${bezel}px #0c0c10, 0 0 0 ${bezel + 1}px rgba(127,127,140,0.35), 0 24px 40px -18px rgba(0,0,0,0.55)`,
                }}
              >
                <div className="absolute inset-0 overflow-hidden bg-neutral-900" style={{ borderRadius: radius }}>
                  {layers.map((l, i) => (
                    // eslint-disable-next-line @next/next/no-img-element -- ImageKit crops to the device shape
                    <img
                      key={l.src}
                      src={l.src}
                      alt={i === layers.length - 1 ? `${FEATURED.title} wallpaper cropped to ${target.width} × ${target.height} for ${target.label}` : ""}
                      aria-hidden={i === layers.length - 1 ? undefined : true}
                      width={target.height > target.width ? 300 : 600}
                      height={Math.round(((target.height > target.width ? 300 : 600) * target.height) / target.width)}
                      decoding="async"
                      fetchPriority="low"
                      onLoad={() => onLoaded(l.src)}
                      className={cn(
                        "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none",
                        l.loaded ? "opacity-100" : "opacity-0"
                      )}
                      draggable={false}
                    />
                  ))}
                  <span
                    className={cn(
                      "absolute left-1/2 top-[2.2%] h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-black transition-opacity duration-300",
                      target.kind === "phone" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-[1.6%] left-1/2 h-[0.9%] min-h-[2px] w-[34%] -translate-x-1/2 rounded-full bg-white/80 transition-opacity duration-300",
                      target.kind === "phone" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>

                {/* laptop deck */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-[9%] h-[7px] w-[118%] rounded-b-[40%_100%] bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-700 transition-opacity duration-300 sm:h-[10px]",
                    target.kind === "laptop" ? "opacity-100" : "opacity-0"
                  )}
                  style={{ top: `calc(100% + ${bezel}px)` }}
                >
                  <span className="absolute left-1/2 top-0 h-[40%] w-[16%] -translate-x-1/2 rounded-b bg-zinc-600" />
                </span>

                {/* monitor stand */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-1/2 flex -translate-x-1/2 flex-col items-center transition-opacity duration-300",
                    target.kind === "desktop" ? "opacity-100" : "opacity-0"
                  )}
                  style={{ top: `calc(100% + ${bezel}px)`, width: "100%" }}
                >
                  <span className="h-3 w-[11%] bg-gradient-to-b from-zinc-700 to-zinc-500 sm:h-5" />
                  <span className="h-[4px] w-[28%] rounded-full bg-zinc-500 sm:h-[5px]" />
                </span>

                {/* floor shadow for handhelds */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-1/2 h-2.5 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/30 blur-md transition-opacity duration-300 dark:bg-black/60",
                    target.kind === "phone" || target.kind === "tablet" ? "opacity-100" : "opacity-0"
                  )}
                  style={{ top: `calc(100% + ${bezel + 8}px)` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
