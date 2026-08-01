import { Metadata } from 'next'
import Link from 'next/link'
import PostLayout from '@/components/blog/PostLayout'
import { postMetadata } from '@/lib/blog/registry'

export const metadata: Metadata = postMetadata('dual-monitor-wallpaper-setup')

export default function Page() {
  return (
    <PostLayout slug="dual-monitor-wallpaper-setup">
      <p>
        Windows and macOS can both run a different wallpaper on every monitor - the settings are just
        buried. Here is the exact click-path for each OS, plus how to stretch a single panoramic image
        across both screens without distortion.
      </p>

      <h2>Windows 11: different wallpaper per monitor</h2>
      <ol>
        <li>Right-click the desktop and choose <strong>Personalize</strong>, then <strong>Background</strong>.</li>
        <li>Set &quot;Personalize your background&quot; to <strong>Picture</strong>.</li>
        <li>Under &quot;Recent images&quot;, click <strong>Browse photos</strong> and add every image you want to use - they must appear in this list first.</li>
        <li>Now <strong>right-click a thumbnail</strong> in that list and choose <strong>Set for monitor 1</strong> (or 2, 3...).</li>
      </ol>
      <p>
        Not sure which monitor is which number? Go to <strong>Settings</strong>, then{' '}
        <strong>System</strong>, then <strong>Display</strong> and press <strong>Identify</strong> - a
        digit flashes on each screen.
      </p>

      <h2>Windows 11: one image spanning both monitors</h2>
      <ol>
        <li>In the same Background settings, pick your image.</li>
        <li>Set &quot;Choose a fit for your desktop image&quot; to <strong>Span</strong>.</li>
      </ol>
      <p>
        The math that makes span look good: your virtual desktop is both resolutions side by side. Two
        1080p monitors = 3840 x 1080, a 32:9 shape. Two 1440p monitors = 5120 x 1440. Regular 16:9
        wallpapers will be brutally cropped at that shape - you want genuinely panoramic art.
        Wide abstract and cityscape images survive spanning best; browse{' '}
        <Link href="/category/abstract">abstract</Link> and <Link href="/category/city">city</Link>{' '}
        wallpapers, or <Link href="/ai-generate">generate a custom panorama with AI</Link> and ask for
        an ultrawide composition.
      </p>

      <h2>macOS: different wallpaper per display</h2>
      <ol>
        <li>Open <strong>System Settings</strong>, then <strong>Wallpaper</strong>.</li>
        <li>With more than one display connected, each display gets its own section at the top - select the image per display.</li>
        <li>Older macOS versions: open <strong>System Preferences</strong>, then <strong>Desktop &amp; Screen Saver</strong>, and a separate chooser window appears on each display.</li>
      </ol>
      <p>
        One macOS quirk: wallpapers are also per-Space. If you use multiple Mission Control Spaces and
        want a consistent look, set the wallpaper while in each Space, or set it before creating new
        Spaces (new ones inherit the current wallpaper).
      </p>

      <h2>Mismatched monitors (the common case)</h2>
      <p>
        A 4K main monitor next to a 1080p side monitor is the typical real-world setup, and it changes
        the advice:
      </p>
      <ul>
        <li><strong>Skip spanning entirely</strong> - mismatched heights and densities make one half look stretched or misaligned. Per-monitor images always look cleaner.</li>
        <li><strong>Match each image to each screen&apos;s native resolution</strong> - the <Link href="/blog/wallpaper-resolution-guide">resolution guide</Link> covers what each panel needs.</li>
        <li><strong>Unify by palette instead of by image.</strong> Two different wallpapers from the same color family - say both from the <Link href="/color/dark">dark collection</Link> or both <Link href="/color/teal">teal</Link> - read as intentional, not random.</li>
        <li>A vertical second monitor wants a portrait image - the <Link href="/category/mobile">mobile section</Link> is full of 9:16 art that fits rotated screens perfectly.</li>
      </ul>

      <h2>Quick answers</h2>
      <h3>Can Windows rotate different slideshows per monitor?</h3>
      <p>
        The built-in slideshow shows different images from one folder on each monitor as it rotates,
        but you cannot assign separate folders per monitor without a third-party tool like DisplayFusion.
      </p>
      <h3>Why is my spanned wallpaper misaligned at the bezel?</h3>
      <p>
        Span assumes your monitors sit edge to edge at the same height. Fix the virtual arrangement in
        Display settings by dragging the monitor rectangles until they match physical reality.
      </p>
    </PostLayout>
  )
}
