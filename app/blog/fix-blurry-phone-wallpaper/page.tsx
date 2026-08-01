import { Metadata } from 'next'
import Link from 'next/link'
import PostLayout from '@/components/blog/PostLayout'
import { postMetadata } from '@/lib/blog/registry'

export const metadata: Metadata = postMetadata('fix-blurry-phone-wallpaper')

export default function Page() {
  return (
    <PostLayout slug="fix-blurry-phone-wallpaper">
      <p>
        A wallpaper that looked sharp in the gallery turns soft, grainy, or weirdly zoomed the moment
        you set it. This has exactly five common causes - run down the list in order and one of them
        will be yours.
      </p>

      <h2>1. The image is smaller than your screen</h2>
      <p>
        The most common cause by far. Modern phone screens are 1080 to 1320 pixels wide and very tall;
        an 800px-wide image has to be stretched over a million extra pixels, and stretching invents
        detail that is not there - that is the blur. Check the image dimensions in your gallery app&apos;s
        info panel: a portrait wallpaper should be <strong>at least 1080 x 2340</strong>, ideally
        1440 x 2560 or more. Exact per-model numbers live in our{' '}
        <Link href="/blog/best-wallpaper-size-for-iphone">iPhone size guide</Link>, and the same logic
        applies to Android.
      </p>

      <h2>2. It came through a messaging app</h2>
      <p>
        WhatsApp, Instagram, Telegram (as &quot;photo&quot;), and most social apps aggressively
        recompress images - a pristine 2 MB wallpaper arrives as a 90 KB mush of JPEG artifacts.
        The blur was added in transit.
      </p>
      <ul>
        <li>Download from the original source instead of saving from a chat. On Wallpaperz the Download button always serves the full-resolution original.</li>
        <li>If someone must send it, tell them to share it <strong>as a file / document</strong>, which skips recompression.</li>
        <li>Never screenshot a wallpaper to save it - you capture your screen&apos;s resolution at screen compression, then re-crop it. Double loss.</li>
      </ul>

      <h2>3. Parallax / motion effects are zooming it</h2>
      <p>
        Both platforms secretly enlarge your wallpaper so it can shift behind the icons when you tilt
        or swipe. That magnification is why a perfectly-sized image still looks slightly cropped and
        softened.
      </p>
      <ul>
        <li><strong>iPhone:</strong> when setting the wallpaper, pinch outward to zoom the image out as far as allowed. On older iOS versions, toggle off Perspective Zoom on the set-wallpaper screen; you can also reduce motion effects under Settings, then Accessibility, then Motion.</li>
        <li><strong>Android:</strong> many launchers scroll the wallpaper across home screens, which needs an extra-wide crop. Look for a &quot;scrolling wallpaper&quot; or &quot;wallpaper motion&quot; toggle in your launcher or wallpaper picker and switch it to static.</li>
      </ul>

      <h2>4. The aspect ratio fights your screen</h2>
      <p>
        A landscape (wide) image set on a portrait screen must be cropped to a thin vertical slice and
        blown up - softness guaranteed. Use art composed for phones: tall 9:16 or 9:19.5 images. The
        entire <Link href="/category/mobile">mobile collection</Link> is portrait-native, so nothing
        gets sliced.
      </p>

      <h2>5. Battery saver or display settings are interfering</h2>
      <p>
        Less common, worth 30 seconds: extreme battery saver modes can lower render resolution, some
        Android skins have a &quot;screen resolution&quot; setting (set to FHD+ or WQHD+, not HD+), and
        aggressive &quot;vivid&quot; display modes can exaggerate compression artifacts. Set one known-good
        high-resolution wallpaper first - if it looks sharp, your settings are fine and the previous
        image was the problem.
      </p>

      <h2>The 30-second fix, summarized</h2>
      <ol>
        <li>Get the original file, not a chat-app copy or screenshot.</li>
        <li>Confirm it is portrait and at least 1440 px wide for modern screens.</li>
        <li>Set it, then pinch out / disable scrolling so the OS crops as little as possible.</li>
      </ol>
      <p>
        Follow those three and blur is basically impossible. If you want wallpapers that pass all the
        checks out of the box, start with the <Link href="/category/mobile">phone wallpapers</Link> or
        the <Link href="/color/dark">dark collection</Link> - every file is served at original
        resolution with no watermarks.
      </p>
    </PostLayout>
  )
}
