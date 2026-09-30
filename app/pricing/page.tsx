import type { Metadata } from "next"
import Link from "next/link"
import { Check, Minus } from "lucide-react"
import PricingPlans from "@/components/pricing/PricingPlans"
import { cn } from "@/lib/utils"
import { FREE_PER_DAY, PLANS, PRO_PER_MONTH } from "@/lib/pricing"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Pricing - AI Wallpaper Generator Plans",
  description: `Generate ${FREE_PER_DAY} AI wallpapers a day for free. Need more? Credit packs from $${PLANS.credits_50.priceUsd}, Pro from $${PLANS.pro_monthly.priceUsd}/month with ${PRO_PER_MONTH} generations and no ads, or a $${PLANS.lifetime.priceUsd} lifetime deal.`,
  alternates: { canonical: "/pricing" },
  openGraph: {
    url: "https://www.wallpaperz.in/pricing",
    title: "Pricing | Wallpaperz",
    images: [DEFAULT_OG_IMAGE],
  },
}

const link = "font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"

const FAQ: { q: string; a: string; body?: React.ReactNode }[] = [
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
    q: "Can I get a refund?",
    a: "Unused credit packs can be refunded within 7 days of purchase. A first Pro or Lifetime purchase can be refunded within 7 days if you've made fewer than 20 AI generations with it. Used credits, renewals and partial periods aren't refundable. Cancelling Pro keeps it active until the period ends. Full details are in our Refund Policy and Terms.",
    body: (
      <>
        Unused credit packs can be refunded within 7 days of purchase. A first Pro or Lifetime purchase can be
        refunded within 7 days if you&apos;ve made fewer than 20 AI generations with it. Used credits, renewals and
        partial periods aren&apos;t refundable. Cancelling Pro keeps it active until the period ends. Full details are
        in our{" "}
        <Link href="/refund-policy" className={link}>Refund Policy</Link> and{" "}
        <Link href="/terms" className={link}>Terms</Link>.
      </>
    ),
  },
  {
    q: "Who processes payments?",
    a: "Payments are handled securely by Dodo Payments, our merchant of record. We never see or store your card details. For billing questions or refunds, contact us.",
  },
]

type Cell = string | boolean
const COMPARE: { label: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { label: "AI wallpapers", cells: [`${FREE_PER_DAY} a day`, `${FREE_PER_DAY} a day + your pack`, `${FREE_PER_DAY} a day + ${PRO_PER_MONTH} a month`, `${FREE_PER_DAY} a day + ${PRO_PER_MONTH} a month`] },
  { label: "Output", cells: ["1344 × 768 PNG", "1344 × 768 PNG", "1344 × 768 PNG", "1344 × 768 PNG"] },
  { label: "Works when free generations pause", cells: [false, true, true, true] },
  { label: "Ad-free site", cells: [false, false, true, true] },
  { label: "Payment", cells: ["None", "One-time", "Monthly or yearly", "One-time"] },
  { label: "Expires", cells: ["Resets daily", "Never", "When you cancel", "Never"] },
]
const COLUMNS = ["Free", "Credits", "Pro", "Lifetime"]
const proCol = "bg-violet-500/[0.035] dark:bg-violet-400/[0.06]"

function CompareCell({ value }: { value: Cell }) {
  if (value === true) return <Check className="h-4 w-4 text-foreground" strokeWidth={2} aria-label="Included" />
  if (value === false) return <Minus className="h-4 w-4 text-muted-foreground/50" aria-label="Not included" />
  return <>{value}</>
}

export default function PricingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="max-w-2xl">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Pricing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">
          Free every day.
          <span className="block text-balance text-muted-foreground">Pay when you want more.</span>
        </h1>
        <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {FREE_PER_DAY} AI wallpapers a day cost nothing. Buy credits, go Pro, or pay once for Lifetime when you
          want to make more.
        </p>
      </header>

      <div className="mt-12">
        <PricingPlans />
      </div>

      <section className="mt-24" aria-labelledby="compare">
        <h2 id="compare" className="text-2xl font-semibold tracking-[-0.025em] text-foreground">Compare plans</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every plan gets the same image quality. The difference is how many you can make.
        </p>
        <div className="-mx-4 mt-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="sticky left-0 z-10 w-[28%] min-w-[9rem] bg-background py-3 pr-4 font-normal text-muted-foreground">
                  <span className="sr-only">Feature</span>
                </th>
                {COLUMNS.map((c) => (
                  <th key={c} scope="col" className={cn("py-3 pl-3 pr-4 font-semibold text-foreground", c === "Pro" && proCol)}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {COMPARE.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="sticky left-0 z-10 bg-background py-3.5 pr-4 font-normal text-muted-foreground">{row.label}</th>
                  {row.cells.map((cell, i) => (
                    <td key={i} className={cn("py-3.5 pl-3 pr-4 tabular-nums text-foreground", COLUMNS[i] === "Pro" && proCol)}>
                      <CompareCell value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-24 grid gap-10 lg:grid-cols-12" aria-labelledby="faq">
        <div className="lg:col-span-4">
          <h2 id="faq" className="text-2xl font-semibold tracking-[-0.025em] text-foreground">Questions</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Something else?{" "}
            <Link href="/contact" className={link}>Ask us</Link>, or{" "}
            <Link href="/ai-generate" className={link}>try the generator free</Link>.
          </p>
        </div>
        <div className="divide-y divide-border/70 border-y border-border/70 lg:col-span-8">
          {FAQ.map(({ q, a, body }) => (
            <details key={q} className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[15px] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60">
                {q}
                <span
                  className="relative h-3 w-3 shrink-0 text-muted-foreground before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform after:duration-200 group-open:after:scale-y-0"
                  aria-hidden
                />
              </summary>
              <p className="max-w-2xl pb-5 text-sm leading-relaxed text-muted-foreground">{body ?? a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-20 flex flex-col gap-2 border-t border-border/70 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Want offline sets? Every device size in one download.{" "}
          <Link href="/packs" className={link}>See Wallpaper Packs →</Link>
        </p>
        <p className="text-xs">Prices in USD. Taxes may apply at checkout. The library stays free for everyone.</p>
      </div>
    </div>
  )
}
