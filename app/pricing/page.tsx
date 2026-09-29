import type { Metadata } from "next"
import Link from "next/link"
import { Wand2 } from "lucide-react"
import PricingPlans from "@/components/pricing/PricingPlans"
import { FREE_PER_DAY, PLANS, PRO_PER_MONTH } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Pricing - AI Wallpaper Generator Plans",
  description: `Generate ${FREE_PER_DAY} AI wallpapers a day for free. Need more? Credit packs from $${PLANS.credits_50.priceUsd}, Pro from $${PLANS.pro_monthly.priceUsd}/month with ${PRO_PER_MONTH} generations and no ads, or a $${PLANS.lifetime.priceUsd} lifetime deal.`,
  alternates: { canonical: "/pricing" },
  openGraph: {
    url: "https://www.wallpaperz.in/pricing",
    title: "Pricing | Wallpaperz",
  },
}

const FAQ = [
  {
    q: "What counts as a generation?",
    a: "Each wallpaper you generate uses one. If the AI fails to return an image, nothing is used: free generations and credits are refunded automatically.",
  },
  {
    q: "In what order are my generations used?",
    a: `Your ${FREE_PER_DAY} free daily generations always go first. Pro members then use their ${PRO_PER_MONTH} monthly generations, and credits are only spent after that.`,
  },
  {
    q: "Do credits expire?",
    a: "No. Credits stay on your account until you use them, and they stack with Pro.",
  },
  {
    q: "How do I cancel Pro?",
    a: "Open Manage billing on this page (or the link in your receipt email) and cancel. You keep Pro until the end of the period you've paid for.",
  },
  {
    q: "What does fair use mean for Lifetime?",
    a: `Lifetime includes the same ${PRO_PER_MONTH} generations a month as Pro, forever, so the generator stays fast and affordable for everyone.`,
  },
  {
    q: "Who processes payments?",
    a: "Payments are handled securely by Dodo Payments, our merchant of record. We never see or store your card details. For billing questions or refunds, contact us.",
  },
]

export default function PricingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_70%)]" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container mx-auto px-4 pb-20 pt-10 sm:pt-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md sm:text-sm">
            <Wand2 className="h-3.5 w-3.5 shrink-0 text-fuchsia-500" />
            Pricing
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            Make more wallpapers.
            <span className="block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 bg-clip-text pb-1 text-transparent">
              Pay only if you want to.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            {FREE_PER_DAY} free AI wallpapers every day. Top up with credits, or go Pro for {PRO_PER_MONTH} a month and an ad-free site.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl">
          <PricingPlans />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Prices in USD. Taxes may apply at checkout. The wallpaper library stays free for everyone.
          </p>
        </div>

        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Questions</h2>
          <div className="mt-6 divide-y rounded-2xl border bg-card/60 backdrop-blur-sm">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Still unsure?{" "}
            <Link href="/ai-generate" className="font-medium text-fuchsia-500 hover:underline">
              Try the generator free
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="font-medium text-fuchsia-500 hover:underline">
              ask us anything
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
