import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { LegalSection, Mail } from "@/components/legal/LegalPage"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "AI Transparency",
  description:
    "How Wallpaperz uses AI: which wallpapers are AI-generated, how the AI wallpaper generator works, its limitations, and how to report a problem.",
  alternates: { canonical: "/ai-transparency" },
  openGraph: { url: "https://www.wallpaperz.in/ai-transparency", title: "AI Transparency | Wallpaperz", images: [DEFAULT_OG_IMAGE] },
}

export default function AiTransparencyPage() {
  return (
    <LegalPage title="AI Transparency" intro="Where we use AI, and what that means for the images you see and make.">
      <LegalSection id="site-wallpapers" title="AI-generated wallpapers on the site">
        <p>
          Many of the wallpapers on Wallpaperz are <strong>created with AI image tools</strong> and then selected and
          curated by us. These are marked <strong>&ldquo;Created with AI&rdquo;</strong> in the details on their
          wallpaper page. Wallpapers without that label are older uploads of photos or artwork from third-party
          sources; where we know the original source, it&apos;s shown on the wallpaper page. AI-generated wallpapers
          are digital artwork: they don&apos;t show real places, people or events, even when they look realistic.
        </p>
      </LegalSection>

      <LegalSection id="generator" title="The AI wallpaper generator">
        <ul>
          <li>
            Every image made with the <Link href="/ai-generate">AI generator</Link> is AI-generated, created by a
            Stability AI model (Stable Diffusion XL) from the prompt you write.
          </li>
          <li>
            Your prompt is sent to Stability AI and the image is returned straight to you. We don&apos;t keep a copy (see
            the <Link href="/privacy#collect">Privacy Policy</Link>).
          </li>
          <li>The generator is presented as an AI tool, so everything it shows you is AI-generated.</li>
          <li>
            Prompts that break our <Link href="/terms#acceptable-use">content policy</Link> may be blocked, and the
            model has its own safety filters.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="limitations" title="Limitations">
        <ul>
          <li>AI images can contain errors, odd details, distorted text or stereotypes.</li>
          <li>Similar prompts can produce similar images for different people, so results aren&apos;t guaranteed unique.</li>
          <li>AI images may unintentionally resemble existing artwork, characters or brands.</li>
          <li>Purely AI-generated images may not be protected by copyright in many countries.</li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" title="Sharing AI images responsibly">
        <p>
          You&apos;re free to share what you make, within our <Link href="/terms">Terms</Link>. If an image could be
          mistaken for a real photo of a real person, place or event, please say it&apos;s AI-generated. Never use the
          generator to deceive people or to create deepfakes.
        </p>
      </LegalSection>

      <LegalSection id="report" title="Report a problem">
        <p>
          If you see an image on Wallpaperz that seems harmful, misleading or infringing, or a wallpaper that should be
          labelled differently, email <Mail /> with the page link. Copyright owners can follow the{" "}
          <Link href="/terms#copyright">copyright complaint process</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
