import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { LegalSection, Mail } from "@/components/legal/LegalPage"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Wallpaper License",
  description:
    "What you can and cannot do with wallpapers downloaded from Wallpaperz: free personal use, attribution, redistribution, commercial use and premium packs explained.",
  alternates: { canonical: "/license" },
  openGraph: { url: "https://www.wallpaperz.in/license", title: "Wallpaper License | Wallpaperz", images: [DEFAULT_OG_IMAGE] },
}

const sources = [
  { name: "Pexels", url: "https://www.pexels.com/license/" },
  { name: "Pixabay", url: "https://pixabay.com/service/license-summary/" },
  { name: "Unsplash", url: "https://unsplash.com/license" },
]

export default function LicensePage() {
  return (
    <LegalPage title="Wallpaper License" intro="Free for personal use. Here's exactly what that covers.">
      <LegalSection id="allowed" title="You can">
        <ul>
          <li>Download any wallpaper for free, without an account.</li>
          <li>Use it as a wallpaper, lock screen or background on your own phones, tablets, computers and TVs.</li>
          <li>Crop, resize or edit it for your own personal use.</li>
          <li>
            Share links to wallpaper pages, or embed a wallpaper on your blog or social post using the credit snippet
            on its page.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="not-allowed" title="You can't">
        <ul>
          <li>Sell, license or give away the wallpapers, on their own or bundled into wallpaper packs.</li>
          <li>Publish them in wallpaper apps, themes, websites or stock collections.</li>
          <li>Use them on merchandise or in print-on-demand products, or turn them into NFTs.</li>
          <li>Claim you created them, or remove credits or watermarks.</li>
          <li>Bulk download or scrape the site, or use the wallpapers to train AI models.</li>
          <li>Use them in ways that suggest a person or brand endorses you.</li>
        </ul>
        <p>
          Want to use a wallpaper commercially (for example in an ad, product or video)? Email <Mail /> and tell us
          which one and how. We&apos;ll let you know if that&apos;s possible.
        </p>
      </LegalSection>

      <LegalSection id="attribution" title="Attribution">
        <p>
          Credit isn&apos;t required for personal use, but it&apos;s always appreciated. When you post a wallpaper
          online, use the snippet on its page or a line like: <em>Wallpaper from Wallpaperz (wallpaperz.in)</em>.
        </p>
      </LegalSection>

      <LegalSection id="sources" title="AI-generated and third-party images">
        <p>
          Many wallpapers are AI-generated (see <Link href="/ai-transparency">AI Transparency</Link>). Some come from
          free image platforms, shown as the &ldquo;Source&rdquo; on the wallpaper page. For those, the original
          platform&apos;s license and the photographer&apos;s rights also apply, and we can&apos;t grant you more rights
          than we have:
        </p>
        <ul>
          {sources.map((s) => (
            <li key={s.name}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name} license
              </a>
            </li>
          ))}
        </ul>
        <p>
          Logos, brands, characters and real people that may appear in images remain the property of their owners.
          If you believe a wallpaper infringes your rights, see the{" "}
          <Link href="/terms#copyright">copyright complaint process</Link>.
        </p>
      </LegalSection>

      <LegalSection id="generated" title="Images you generate">
        <p>
          Images you create with the <Link href="/ai-generate">AI generator</Link> aren&apos;t covered by this license.
          You may use them for personal and commercial purposes, as described in the{" "}
          <Link href="/terms#ai-outputs">Terms of Service</Link>.
        </p>
      </LegalSection>

      <LegalSection id="packs" title="Premium packs">
        <p>
          Premium wallpaper packs sold on our{" "}
          <a href="https://prasenjitt.gumroad.com" target="_blank" rel="noopener noreferrer">
            Gumroad store
          </a>{" "}
          come with a personal-use license: use them on your own devices, but don&apos;t share, resell or redistribute
          the files.
        </p>
      </LegalSection>

      <LegalSection id="code" title="Source code">
        <p>
          This license covers images. The website&apos;s source code is open source and published separately on{" "}
          <a href="https://github.com/StarKnightt/wallpaperz" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          under the license in that repository, which doesn&apos;t apply to the wallpapers.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
