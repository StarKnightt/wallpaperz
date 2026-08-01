import { Metadata } from 'next'
import Link from 'next/link'
import PostLayout from '@/components/blog/PostLayout'
import { postMetadata } from '@/lib/blog/registry'

export const metadata: Metadata = postMetadata('how-to-set-live-wallpaper-windows-11')

export default function Page() {
  return (
    <PostLayout slug="how-to-set-live-wallpaper-windows-11">
      <p>
        Windows 11 still does not ship with a true animated wallpaper feature, but getting one takes
        about five minutes with the right free tool. This guide covers everything: what Windows can do
        out of the box, the best free app for video wallpapers, and the settings that stop a live
        wallpaper from eating your battery.
      </p>

      <h2>What counts as a &quot;live&quot; wallpaper?</h2>
      <p>People usually mean one of four different things:</p>
      <ul>
        <li><strong>Slideshow</strong> - a folder of images that rotates automatically. Built into Windows.</li>
        <li><strong>Windows Spotlight</strong> - Bing photography that changes daily. Also built in.</li>
        <li><strong>Video wallpaper</strong> - an actual looping video (or animated scene) behind your icons. Needs a third-party app.</li>
        <li><strong>Interactive wallpaper</strong> - reacts to your mouse or audio. Also third-party.</li>
      </ul>

      <h2>Option 1: The built-in slideshow (no installs)</h2>
      <ol>
        <li>Download a handful of wallpapers into one folder - a themed set works best, like a{' '}
          <Link href="/color/dark">dark collection</Link> or{' '}
          <Link href="/color/blue">blue tones</Link> so the rotation feels coherent.</li>
        <li>Right-click the desktop and choose <strong>Personalize</strong>.</li>
        <li>Open <strong>Background</strong>, then set &quot;Personalize your background&quot; to <strong>Slideshow</strong>.</li>
        <li>Point it at your folder and pick an interval - 30 minutes is a good default. Enable <strong>Shuffle</strong> if you like surprises.</li>
      </ol>
      <p>
        This is the zero-cost, zero-performance-impact option. The only limitation: images swap with a
        simple fade, nothing actually moves.
      </p>

      <h2>Option 2: Lively Wallpaper (free, open source)</h2>
      <p>
        <a href="https://www.rocksdanister.com/lively/" target="_blank" rel="noopener noreferrer">Lively Wallpaper</a>{' '}
        is the tool most people should use. It is free, open source, and available straight from the
        Microsoft Store, which means no sketchy installers.
      </p>
      <ol>
        <li>Install <strong>Lively Wallpaper</strong> from the Microsoft Store.</li>
        <li>Open it - it ships with a few animated scenes you can apply with one click.</li>
        <li>To use your own video: drag any <code>.mp4</code> file into the Lively window, then click it to apply.</li>
        <li>Right-click a wallpaper inside Lively for per-monitor controls if you run more than one screen.</li>
      </ol>
      <p>
        Lively also accepts YouTube links and interactive web pages as wallpapers, which is fun to
        experiment with - though local video files loop the smoothest.
      </p>

      <h3>Wallpaper Engine (paid alternative)</h3>
      <p>
        <a href="https://store.steampowered.com/app/431960/Wallpaper_Engine/" target="_blank" rel="noopener noreferrer">Wallpaper Engine</a>{' '}
        on Steam costs a few dollars and adds a massive workshop of community-made scenes, audio
        visualizers, and deep customization. If you end up loving live wallpapers, it is worth the
        upgrade - but try Lively first. For most setups the free option is enough.
      </p>

      <h2>Keep it from draining your battery</h2>
      <p>
        A looping video uses GPU cycles. Both Lively and Wallpaper Engine are smart about it, but check
        these settings once:
      </p>
      <ul>
        <li><strong>Pause when fullscreen apps run</strong> - on by default in both apps; the wallpaper stops while you game or watch video, so there is no real performance cost when it matters.</li>
        <li><strong>Pause on battery</strong> - in Lively under Settings, then Performance. On a laptop this is the single most important toggle.</li>
        <li><strong>Match your resolution</strong> - a 4K video on a 1080p laptop wastes decode power. Our <Link href="/blog/wallpaper-resolution-guide">resolution guide</Link> explains what your screen actually needs.</li>
      </ul>

      <h2>Static wallpaper, but make it feel alive</h2>
      <p>
        Honest take: a great static wallpaper at your screen&apos;s native resolution often looks better
        than a mediocre looping video. High-contrast art with a strong light source - neon cityscapes,
        auroras, glowing fantasy scenes - reads as &quot;alive&quot; without using a single GPU cycle.
        Browse the <Link href="/category/fantasy">fantasy</Link> and{' '}
        <Link href="/category/space">space</Link> collections, or{' '}
        <Link href="/ai-generate">generate a custom scene with AI</Link> and set it as a plain
        background.
      </p>

      <h2>Quick answers</h2>
      <h3>Does a live wallpaper slow down Windows 11?</h3>
      <p>
        While you work in maximized or fullscreen windows, no - the wallpaper pauses. You pay a small
        GPU cost only while your desktop is actually visible.
      </p>
      <h3>Can I set different live wallpapers per monitor?</h3>
      <p>
        Yes. Lively and Wallpaper Engine both support per-monitor wallpapers, including mixing a video
        on one screen with a static image on the other.
      </p>
      <h3>Do live wallpapers work on the lock screen?</h3>
      <p>
        No - Windows 11 lock screens only accept static images and Spotlight. Set a matching still
        frame from your video for a consistent look.
      </p>
    </PostLayout>
  )
}
