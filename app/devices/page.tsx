import { Metadata } from 'next'
import Link from 'next/link'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import { DEVICES, KIND_LABEL, DeviceKind, aspectLabel, wallpapersForDevice } from '@/lib/devices'
import ScreenDetector from '@/components/ScreenDetector'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Wallpaper Size for Every Phone, iPad, Mac & Monitor (2026)',
  description:
    'Exact wallpaper resolutions for iPhone 18, iPhone 17, Galaxy S26, Pixel 10, iPad, MacBook and 1080p/1440p/4K monitors - plus free wallpapers cropped to fit each screen.',
  alternates: { canonical: '/devices' },
}

const ORDER: DeviceKind[] = ['phone', 'tablet', 'laptop', 'desktop']

export default async function DevicesPage() {
  const all = await getAllWallpapers()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Wallpapers sized for your exact screen</h1>
        <p className="mt-3 text-muted-foreground">
          Pick your device to see its wallpaper resolution and download wallpapers cropped to fit it
          pixel for pixel. No zoom, no stretching, no black bars.
        </p>
      </header>

      <div className="mt-8">
        <ScreenDetector />
      </div>

      {ORDER.map((kind) => {
        const devices = DEVICES.filter((d) => d.kind === kind)
        return (
          <section key={kind} className="mt-12">
            <h2 className="text-xl font-bold">{KIND_LABEL[kind]}</h2>
            <div className="mt-4 overflow-hidden rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Device</th>
                    <th className="px-4 py-2.5 font-medium">Wallpaper size</th>
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Aspect</th>
                    <th className="px-4 py-2.5 text-right font-medium">Wallpapers</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {devices.map((d) => (
                    <tr key={d.slug} className="transition-colors hover:bg-muted/40">
                      <td className="px-4 py-2.5">
                        <Link href={`/devices/${d.slug}`} className="font-medium hover:text-primary">{d.name}</Link>
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">{d.width} × {d.height}</td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{aspectLabel(d.width, d.height)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <Link href={`/devices/${d.slug}`} className="text-primary hover:underline tabular-nums">
                          {wallpapersForDevice(all, d).length} &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}

      <p className="mt-10 text-sm text-muted-foreground">
        More detail on how iOS crops wallpapers:{' '}
        <Link href="/blog/best-wallpaper-size-for-iphone" className="text-primary hover:underline">best wallpaper size for iPhone</Link>
        {' '}and the{' '}
        <Link href="/blog/wallpaper-resolution-guide" className="text-primary hover:underline">wallpaper resolution guide</Link>.
      </p>
    </div>
  )
}
