import { Metadata } from 'next'
import Link from 'next/link'
import PostLayout from '@/components/blog/PostLayout'
import { postMetadata } from '@/lib/blog/registry'

export const metadata: Metadata = postMetadata('best-wallpaper-size-for-iphone')

export default function Page() {
  return (
    <PostLayout slug="best-wallpaper-size-for-iphone">
      <p>
        Short answer: download a portrait image that is <strong>at least as large as your iPhone&apos;s
        native resolution</strong>, ideally bigger. A 4K portrait wallpaper (2160x3840) covers every
        iPhone ever made with room to spare. If you want the exact numbers for your model, the full
        table is below.
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
          <tr><td>iPhone 16 Pro Max</td><td>1320 x 2868</td></tr>
          <tr><td>iPhone 16 Pro</td><td>1206 x 2622</td></tr>
          <tr><td>iPhone 16 Plus / 15 Plus / 15 Pro Max / 14 Pro Max</td><td>1290 x 2796</td></tr>
          <tr><td>iPhone 16 / 15 / 15 Pro / 14 Pro</td><td>1179 x 2556</td></tr>
          <tr><td>iPhone 14 / 13 / 13 Pro / 12 / 12 Pro</td><td>1170 x 2532</td></tr>
          <tr><td>iPhone 14 Plus / 13 Pro Max / 12 Pro Max</td><td>1284 x 2778</td></tr>
          <tr><td>iPhone 13 mini / 12 mini</td><td>1080 x 2340</td></tr>
          <tr><td>iPhone 11 Pro / XS / X</td><td>1125 x 2436</td></tr>
          <tr><td>iPhone 11 / XR</td><td>828 x 1792</td></tr>
          <tr><td>iPhone SE (2020 / 2022)</td><td>750 x 1334</td></tr>
        </tbody>
      </table>
      <p>
        Newer models (the iPhone 17 family and beyond) stay in the same class - tall 9:19.5-ish panels
        around 1300 x 2800. Any image at <strong>1440 x 3120 or larger</strong> covers the entire
        current lineup, which is why our <Link href="/category/mobile">mobile wallpapers</Link> are
        produced at 1440 x 2560 minimum and most at higher.
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
