import { Metadata } from 'next'
import Link from 'next/link'
import PostLayout from '@/components/blog/PostLayout'
import { postMetadata } from '@/lib/blog/registry'

export const metadata: Metadata = postMetadata('wallpaper-resolution-guide')

export default function Page() {
  return (
    <PostLayout slug="wallpaper-resolution-guide">
      <p>
        The rule that settles almost every wallpaper resolution question:{' '}
        <strong>the image should match or exceed your screen&apos;s native resolution.</strong>{' '}
        Downscaling a big image looks great. Upscaling a small one always looks soft. Everything else
        in this guide is detail on top of that rule.
      </p>

      <h2>The three numbers that matter</h2>
      <ul>
        <li><strong>Resolution</strong> - the pixel dimensions of your screen (e.g. 2560 x 1440). Found under Display settings on any OS.</li>
        <li><strong>Aspect ratio</strong> - the shape: 16:9 for most monitors, 16:10 for many laptops, 21:9 ultrawide, roughly 9:19.5 for phones.</li>
        <li><strong>Pixel density (PPI)</strong> - how tightly packed those pixels are. High-PPI screens (phones, Retina MacBooks) are unforgiving of low-res images because every flaw is rendered crisply.</li>
      </ul>

      <h2>Common screens and what to download</h2>
      <table>
        <thead>
          <tr>
            <th>Screen</th>
            <th>Native resolution</th>
            <th>Download at least</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1080p monitor / laptop</td><td>1920 x 1080</td><td>1920 x 1080 (2K+ recommended)</td></tr>
          <tr><td>1440p / QHD monitor</td><td>2560 x 1440</td><td>2560 x 1440</td></tr>
          <tr><td>4K monitor / TV</td><td>3840 x 2160</td><td>3840 x 2160</td></tr>
          <tr><td>MacBook Air / Pro (Retina)</td><td>2560 x 1664 to 3456 x 2234</td><td>2880 x 1800 or larger</td></tr>
          <tr><td>Ultrawide monitor</td><td>3440 x 1440</td><td>3440 x 1440 (21:9 image)</td></tr>
          <tr><td>Modern phone</td><td>~1080-1320 wide, portrait</td><td>1440 x 2560 portrait or larger</td></tr>
          <tr><td>iPad / tablet</td><td>2048 x 2732 class</td><td>2732 x 2732 or a large 4:3 crop</td></tr>
        </tbody>
      </table>
      <p>
        For phones the shape matters as much as the size - see the exact figures in our{' '}
        <Link href="/blog/best-wallpaper-size-for-iphone">iPhone wallpaper size guide</Link> or browse{' '}
        <Link href="/category/mobile">wallpapers already sized for phones</Link>.
      </p>

      <h2>Why a 4K wallpaper looks better even on a 1080p screen</h2>
      <p>This surprises people, but there are three real reasons to grab the larger file:</p>
      <ol>
        <li><strong>Downscaling is free sharpening.</strong> When your OS shrinks a 4K image to fit a 1080p screen, four source pixels inform every displayed pixel. Noise averages out; edges get cleaner. The result genuinely looks better than a native 1080p file.</li>
        <li><strong>Cropping freedom.</strong> A big image survives being recropped for an ultrawide, a vertical monitor, or a phone. A native-res image has zero margin.</li>
        <li><strong>Future screens.</strong> Wallpapers outlive monitors. The 4K file still looks perfect after your next upgrade.</li>
      </ol>
      <p>
        The only cost is file size, and for a wallpaper you set once, that is irrelevant. This is why
        every download on Wallpaperz serves the original full-resolution file rather than a recompressed
        copy.
      </p>

      <h2>Aspect ratio: why wallpapers get cropped</h2>
      <p>
        When image shape and screen shape differ, the OS has two options: crop the image (&quot;fill&quot;)
        or letterbox it with bars (&quot;fit&quot;). Fill is almost always the right choice - but it
        means the edges of the image disappear. Practical consequences:
      </p>
      <ul>
        <li>A 16:9 image on a 16:10 laptop loses a sliver from the left and right - rarely noticeable.</li>
        <li>A 16:9 image on an ultrawide loses the entire top and bottom - very noticeable. Ultrawides deserve native 21:9 art.</li>
        <li>A landscape image on a phone is unusable - a 9:16 portrait crop keeps the subject. Phone wallpapers should be portrait, full stop.</li>
      </ul>

      <h2>Formats and compression, briefly</h2>
      <ul>
        <li><strong>JPEG</strong> - right for photos and painterly art. At quality 85+, compression is invisible at viewing distance.</li>
        <li><strong>PNG</strong> - right for flat art, sharp geometry, and text, where JPEG produces faint ringing around edges.</li>
        <li><strong>Re-saves are the killer.</strong> Every pass through a messaging app or &quot;optimizer&quot; recompresses the image. Always download from the source - never save a wallpaper out of a chat thread.</li>
      </ul>

      <h2>The cheat sheet</h2>
      <ul>
        <li>Find your native resolution in Display settings.</li>
        <li>Download at that size or larger - bigger never hurts.</li>
        <li>Match orientation: landscape for monitors, portrait for phones.</li>
        <li>Ultrawide? Get real 21:9 art, not cropped 16:9.</li>
        <li>Multiple monitors? See our <Link href="/blog/dual-monitor-wallpaper-setup">dual monitor wallpaper guide</Link>.</li>
      </ul>
      <p>
        Or skip the math: browse by color - <Link href="/color/dark">dark</Link>,{' '}
        <Link href="/color/blue">blue</Link>, <Link href="/color/black">black</Link> - and every
        download is the original high-resolution file.
      </p>
    </PostLayout>
  )
}
