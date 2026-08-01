import { Metadata } from 'next'
import Link from 'next/link'
import PostLayout from '@/components/blog/PostLayout'
import { postMetadata } from '@/lib/blog/registry'
import { getAllWallpapers } from '@/lib/server/wallpapers'
import ColorPageClient from '@/components/ColorPageClient'

export const metadata: Metadata = postMetadata('dark-aesthetic-wallpapers')
export const revalidate = 3600

export default async function Page() {
  // Live picks: pulls the current dark-tagged wallpapers so this post never goes stale
  const all = await getAllWallpapers()
  const darkPicks = all.filter((w) => w.tags?.includes('color-dark')).slice(0, 12)

  return (
    <PostLayout slug="dark-aesthetic-wallpapers">
      <p>
        Scroll through any desk-setup thread and the pattern is obvious: dark wallpapers everywhere.
        It is not just fashion - dark backgrounds are objectively the practical choice for modern
        screens, and they happen to look fantastic doing it.
      </p>

      <h2>Why dark wallpapers actually make sense</h2>
      <ul>
        <li>
          <strong>OLED screens turn black pixels off.</strong> On an OLED phone or monitor, black areas
          consume essentially no power and produce true black - infinite contrast. A mostly-black
          wallpaper directly extends phone battery life at high brightness.
        </li>
        <li>
          <strong>Your icons win the contrast war.</strong> App icons and widgets are small and
          colorful; on a bright busy background they drown. On a dark canvas they pop without effort.
        </li>
        <li>
          <strong>Less glare at night.</strong> A bright wallpaper in a dim room is a flashlight to the
          face every time you minimize a window. Dark backgrounds keep the late-night desk calm - they
          pair naturally with dark mode UIs.
        </li>
        <li>
          <strong>They hide sins.</strong> Dust on the screen, JPEG artifacts, mismatched bezels - all
          less visible against dark tones.
        </li>
      </ul>

      <h2>The four flavors of dark aesthetic</h2>
      <ul>
        <li><strong>Pure minimal black</strong> - a single subject floating in true black. The battery king, and the cleanest desktop look. Most of the <Link href="/color/black">black collection</Link> lives here.</li>
        <li><strong>Neon on black</strong> - cyberpunk streets, synthwave grids, glowing katanas. Dark base, electric accents. See <Link href="/color/blue">blue</Link> and <Link href="/color/pink">pink</Link> for the classic neon palettes.</li>
        <li><strong>Moody nature</strong> - night skies, misty forests, mountain silhouettes. Dark without feeling digital.</li>
        <li><strong>Deep space</strong> - nebulas and black holes are natively dark; the <Link href="/category/space">space category</Link> is practically a dark-aesthetic collection by itself.</li>
      </ul>

      <h2>Our current dark picks</h2>
      <p>
        These are pulled live from the <Link href="/color/dark">dark collection</Link> - every one is
        free, original, and available in full resolution:
      </p>

      <div className="not-prose my-8">
        <ColorPageClient wallpapers={darkPicks} />
      </div>

      <p>
        Want the full set? Browse all <Link href="/color/dark">dark wallpapers</Link> and{' '}
        <Link href="/color/black">black wallpapers</Link>, or{' '}
        <Link href="/ai-generate">generate your own</Link> - prompt for &quot;matte black background,
        single glowing subject, huge negative space&quot; and you are most of the way there.
      </p>

      <h2>One practical tip</h2>
      <p>
        On phones, set the darkest wallpaper on the <em>home screen</em> specifically - that is the
        screen you see all day, so it earns the OLED savings and keeps icons readable. A more dramatic
        dark scene works better on the lock screen where nothing competes with it. And if your dark
        wallpaper looks washed out or gray on screen, your display&apos;s contrast or HDR settings are
        lifting blacks - the fix lives in display settings, not the image.
      </p>
    </PostLayout>
  )
}
