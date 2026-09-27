import { Metadata } from 'next'
import Link from 'next/link'
import PostLayout from '@/components/blog/PostLayout'
import { postMetadata } from '@/lib/blog/registry'

export const metadata: Metadata = postMetadata('best-wallpaper-size-for-iphone')

const JUMP: [string, string][] = [
  ['iphone-18-pro-max', '18 Pro Max'], ['iphone-17-pro-max', '17 Pro Max'], ['iphone-17', '17'],
  ['iphone-air', 'Air'], ['iphone-16-pro-max', '16 Pro Max'], ['iphone-16', '16'], ['iphone-15', '15'],
]

const IPHONE_ROWS: { label: string; size: string; slug?: string }[] = [
  { label: 'iPhone 18 Pro Max / 17 Pro Max / 16 Pro Max', size: '1320 x 2868', slug: 'iphone-18-pro-max' },
  { label: 'iPhone 18 Pro / 17 Pro / 17 / 16 Pro', size: '1206 x 2622', slug: 'iphone-18-pro' },
  { label: 'iPhone Air', size: '1260 x 2736', slug: 'iphone-air' },
  { label: 'iPhone 16 Plus / 15 Plus / 15 Pro Max / 14 Pro Max', size: '1290 x 2796', slug: 'iphone-16-plus' },
  { label: 'iPhone 16 / 15 / 15 Pro / 14 Pro', size: '1179 x 2556', slug: 'iphone-16' },
  { label: 'iPhone 16e / 14 / 13 / 13 Pro / 12 / 12 Pro', size: '1170 x 2532', slug: 'iphone-16e' },
  { label: 'iPhone 14 Plus / 13 Pro Max / 12 Pro Max', size: '1284 x 2778', slug: 'iphone-13-pro-max' },
  { label: 'iPhone 13 mini / 12 mini', size: '1080 x 2340', slug: 'iphone-13-mini' },
  { label: 'iPhone 11 Pro / XS / X', size: '1125 x 2436' },
  { label: 'iPhone 11 / XR', size: '828 x 1792', slug: 'iphone-11' },
  { label: 'iPhone SE (2020 / 2022)', size: '750 x 1334', slug: 'iphone-se' },
]

export default function Page() {
  return (
    <PostLayout slug="best-wallpaper-size-for-iphone">
      <p>
        Short answer: the <strong>iPhone 18 Pro Max and 17 Pro Max use 1320 x 2868</strong>, the{' '}
        <strong>iPhone 18 Pro, 17 Pro and 17 use 1206 x 2622</strong>, and the iPhone Air uses 1260 x 2736 -
        all a tall 9:19.5 portrait shape. Use an image at least that large. Every model is in the table
        below, and each one links to wallpapers already{' '}
        <Link href="/devices">cropped to that exact size</Link>.
      </p>
      <p>
        <strong>Jump to your iPhone:</strong>{' '}
        {JUMP.map(([slug, name], i) => (
          <span key={slug}>
            {i > 0 && ' · '}
            <Link href={`/devices/${slug}`}>{name}</Link>
          </span>
        ))}
        {' · '}<Link href="/devices">all devices</Link>
      </p>

      <h2>Why your wallpaper looks zoomed in</h2>
      <p>
        iOS crops beyond the visible screen area to power the subtle parallax effect (the wallpaper
        shifts slightly as you tilt the phone) and the lock-screen depth effect. That overscan means an
        image sized <em>exactly</em> to your screen gets magnified a little, and anything smaller gets
        upscaled and turns soft. Two rules fix 95% of problems:
      </p>
      <ul>
        <li>Use an image <strong>larger</strong> than your screen resolution, in portrait orientation.</li>
        <li>Prefer a 9:19.5 aspect ratio (the shape of every modern iPhone) so nothing important gets cropped away.</li>
      </ul>

      <h2>iPhone wallpaper resolutions by model</h2>
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Resolution (px)</th>
          </tr>
        </thead>
        <tbody>
          {IPHONE_ROWS.map((r) => (
            <tr key={r.label}>
              <td>{r.slug ? <Link href={`/devices/${r.slug}`}>{r.label}</Link> : r.label}</td>
              <td>{r.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Notice how few distinct sizes there are: Apple reuses panels across generations, so an
        iPhone 16 Pro Max wallpaper fits a 17 Pro Max and 18 Pro Max perfectly. Any image at{' '}
        <strong>1440 x 3120 or larger</strong> covers the entire current lineup, and our{' '}
        <Link href="/category/mobile">mobile wallpapers</Link> can be downloaded pre-cropped for each
        model from its <Link href="/devices">device page</Link>.
      </p>

      <h2>How to set it without weird cropping</h2>
      <ol>
        <li>Download the wallpaper in <strong>original quality</strong> - long-press saves from a browser sometimes grab a compressed preview instead. On Wallpaperz, use the Download button, which always serves the full file.</li>
        <li>Open <strong>Settings</strong>, then <strong>Wallpaper</strong>, then <strong>Add New Wallpaper</strong> and pick the image.</li>
        <li>In the preview, <strong>pinch to zoom out</strong> as far as it allows - that minimizes the parallax crop.</li>
        <li>If the image still feels too zoomed, the source is too small for your screen. Grab a larger version instead of forcing it.</li>
      </ol>

      <h2>Lock screen vs home screen</h2>
      <p>
        Since iOS 16, lock screens favor images with a clear subject - the depth effect can float the
        clock behind a mountain peak or a character&apos;s head, which looks fantastic with portrait-style
        art. For home screens, busy images fight with your app icons; calmer{' '}
        <Link href="/color/dark">dark</Link> or <Link href="/category/minimalist">minimalist</Link>{' '}
        wallpapers keep everything readable. A popular combo: a dramatic lock screen and a quiet,
        nearly-black home screen - which also saves battery on any OLED iPhone (that is every model
        since the iPhone X, except the XR, 11, and SE).
      </p>

      <h2>Still blurry after all that?</h2>
      <p>
        If a properly-sized wallpaper still looks soft, something else is going on - usually
        compression from a messaging app or a screenshot masquerading as the original file. We wrote a
        full checklist: <Link href="/blog/fix-blurry-phone-wallpaper">why your phone wallpaper looks
        blurry and how to fix it</Link>.
      </p>
    </PostLayout>
  )
}
