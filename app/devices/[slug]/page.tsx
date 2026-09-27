import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Download } from 'lucide-react'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import { wallpaperPath } from '@/lib/wallpaper-url'
import {
  DEVICES, KIND_LABEL, Device, getDevice, sameSizeDevices, aspectLabel,
  wallpapersForDevice, deviceDownloadUrl, deviceThumbUrl,
} from '@/lib/devices'

export const revalidate = 3600

export function generateStaticParams() {
  return DEVICES.map((d) => ({ slug: d.slug }))
}

type Props = { params: Promise<{ slug: string }> }

const BASE_URL = 'https://www.wallpaperz.in'

function heading(d: Device) {
  return d.brand === 'Monitor' ? `${d.width}×${d.height} Wallpapers` : `${d.name} Wallpapers`
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const d = getDevice(slug)
  if (!d) return { title: 'Device not found' }
  const all = await getAllWallpapers()
  const count = wallpapersForDevice(all, d).length
  const size = `${d.width}×${d.height}`
  const title = d.brand === 'Monitor'
    ? `${size} Wallpapers - ${count} Free ${d.name.match(/\((.+)\)/)?.[1] ?? ''} Downloads`.replace(/\s+/g, ' ')
    : `${d.name} Wallpapers (${size}) - Free, Exact Fit`
  const description = d.brand === 'Monitor'
    ? `${count} free wallpapers cropped to exactly ${d.width} x ${d.height} pixels for ${d.display}. No stretching, no black bars - download and set.`
    : `The ${d.name} wallpaper size is ${d.width} x ${d.height} pixels (${aspectLabel(d.width, d.height)}). Download ${count} free wallpapers cropped to fit its screen exactly.`
  return {
    title,
    description,
    alternates: { canonical: `/devices/${d.slug}` },
    openGraph: { title, description, url: `${BASE_URL}/devices/${d.slug}`, siteName: 'Wallpaperz', type: 'website' },
  }
}

function setupSteps(d: Device): { platform: string; steps: string[] } {
  if (d.brand === 'Apple' && d.kind === 'phone') return {
    platform: 'iPhone',
    steps: [
      'Tap Download below and save the image to Photos.',
      'Open Settings, then Wallpaper, then Add New Wallpaper, and pick it.',
      'Pinch out fully in the preview - the image already matches your screen, so nothing important gets cropped.',
    ],
  }
  if (d.kind === 'phone') return {
    platform: 'Android',
    steps: [
      'Tap Download below; the image lands in your Downloads or Gallery.',
      'Long-press your home screen, then choose Wallpaper & style (or Wallpapers).',
      'Pick the image from Gallery and apply it to the home screen, lock screen, or both.',
    ],
  }
  if (d.kind === 'tablet') return {
    platform: 'iPad',
    steps: [
      'Download the image and save it to Photos.',
      'Open Settings, then Wallpaper, then Add New Wallpaper.',
      'iPadOS rotates the wallpaper with the device; these are cropped to landscape, the way most people use an iPad with a keyboard.',
    ],
  }
  if (d.brand === 'Apple') return {
    platform: 'Mac',
    steps: [
      'Download the image.',
      'Open System Settings, then Wallpaper, then Add Photo (or drag the file onto the wallpaper list).',
      'Choose "Fill Screen" - since it is already your native resolution, it stays pin-sharp.',
    ],
  }
  return {
    platform: 'Windows and Mac',
    steps: [
      'Download the image.',
      'Windows: right-click the file and choose "Set as desktop background". Mac: System Settings, then Wallpaper, then Add Photo.',
      'Use "Fill" - at native resolution there is no stretching or letterboxing.',
    ],
  }
}

export default async function DevicePage(props: Props) {
  const { slug } = await props.params
  const d = getDevice(slug)
  if (!d) notFound()

  const all = await getAllWallpapers()
  const wallpapers = wallpapersForDevice(all, d)
  const twins = sameSizeDevices(d)
  const siblings = DEVICES.filter((x) => x.kind === d.kind && x.slug !== d.slug)
  const portrait = d.height > d.width
  const { platform, steps } = setupSteps(d)

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Devices', item: `${BASE_URL}/devices` },
      { '@type': 'ListItem', position: 3, name: heading(d), item: `${BASE_URL}/devices/${d.slug}` },
    ],
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/devices" className="hover:text-foreground">Devices</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{d.brand === 'Monitor' ? `${d.width}×${d.height}` : d.name}</span>
      </nav>

      <header className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading(d)}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {wallpapers.length} free wallpapers cropped to exactly {d.width} × {d.height} pixels
            {d.display ? ` for the ${d.display} display` : ''}. They fill the screen edge to edge with no
            stretching, zoom, or black bars.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl border bg-card p-4 text-sm sm:min-w-[300px]">
          <dt className="col-span-2 text-xs uppercase tracking-wider text-muted-foreground">
            {d.brand === 'Monitor' ? 'Resolution' : `${d.name} wallpaper size`}
          </dt>
          <dd className="col-span-2 text-2xl font-bold tabular-nums">{d.width} × {d.height} px</dd>
          <dt className="text-muted-foreground">Aspect ratio</dt>
          <dd className="font-medium">{aspectLabel(d.width, d.height)}</dd>
          <dt className="text-muted-foreground">Orientation</dt>
          <dd className="font-medium">{portrait ? 'Portrait' : 'Landscape'}</dd>
          {twins.length > 0 && (
            <>
              <dt className="col-span-2 mt-1 text-muted-foreground">Same screen size as</dt>
              <dd className="col-span-2 flex flex-wrap gap-x-3 gap-y-1">
                {twins.map((t) => (
                  <Link key={t.slug} href={`/devices/${t.slug}`} className="font-medium text-primary hover:underline">{t.name}</Link>
                ))}
              </dd>
            </>
          )}
        </dl>
      </header>

      {wallpapers.length === 0 ? (
        <p className="mt-10 rounded-xl border p-8 text-center text-muted-foreground">
          New wallpapers at this size are on the way. Meanwhile, <Link href="/" className="text-primary hover:underline">browse the full library</Link>.
        </p>
      ) : (
        <ul className={`mt-8 grid gap-4 ${portrait ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {wallpapers.map((w, i) => (
            <li key={w.id} className="group overflow-hidden rounded-xl border bg-card">
              <Link href={wallpaperPath(w)} className="relative block overflow-hidden bg-muted" style={{ aspectRatio: `${d.width} / ${d.height}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- ImageKit crops to the device shape */}
                <img
                  src={deviceThumbUrl(w, d, portrait ? 300 : 560)}
                  alt={`${w.title} wallpaper for ${d.name} (${d.width}x${d.height})`}
                  loading={i < (portrait ? 5 : 3) ? 'eager' : 'lazy'}
                  width={portrait ? 300 : 560}
                  height={Math.round(((portrait ? 300 : 560) * d.height) / d.width)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex items-center justify-between gap-2 p-2.5">
                <Link href={wallpaperPath(w)} className="min-w-0 truncate text-sm font-medium hover:text-primary">{w.title}</Link>
                <a
                  href={deviceDownloadUrl(w, d)}
                  rel="nofollow"
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90"
                  aria-label={`Download ${w.title} at ${d.width} by ${d.height}`}
                  title={`Download ${d.width}×${d.height}`}
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-14 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">How to set it on your {platform}</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground">
            {steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-bold">Why the exact size matters</h2>
          <p className="mt-4 text-muted-foreground">
            A wallpaper that doesn&apos;t match your screen gets scaled and cropped by the system - usually
            zoomed in, sometimes soft. Every download on this page is cut to {d.width} × {d.height} with smart
            focus, so the subject stays centered and each pixel maps 1:1 to your display. Want the untouched
            original instead? Open any wallpaper and use its main Download button.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold">Other {KIND_LABEL[d.kind].toLowerCase()}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {siblings.map((s) => (
            <li key={s.slug}>
              <Link href={`/devices/${s.slug}`} className="inline-flex items-baseline gap-2 rounded-full border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                {s.name}
                <span className="text-xs text-muted-foreground tabular-nums">{s.width}×{s.height}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/devices" className="inline-flex rounded-full px-3 py-1.5 text-sm font-medium text-primary hover:underline">All devices &rarr;</Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
