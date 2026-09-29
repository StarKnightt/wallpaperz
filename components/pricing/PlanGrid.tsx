"use client"

import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import CheckoutConsent from "@/components/legal/CheckoutConsent"
import { FREE_PER_DAY, PLANS, PRO_PER_MONTH, type PlanKey } from "@/lib/pricing"

export type Billing = "monthly" | "yearly"
export type Pack = "credits_50" | "credits_150"

export const YEARLY_SAVING = Math.round((1 - PLANS.pro_yearly.priceUsd / (PLANS.pro_monthly.priceUsd * 12)) * 100)

export interface PlanGridProps {
  isSignedIn: boolean
  hasPro: boolean
  hasLifetime: boolean
  billing: Billing
  onBillingChange: (b: Billing) => void
  pack: Pack
  onPackChange: (p: Pack) => void
  pending: PlanKey | null
  failed: PlanKey | null
  onBuy: (plan: PlanKey) => void
  discountCode?: string
}

function Segmented<T extends string>({ value, onChange, options, label }: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: React.ReactNode }[]
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-border bg-foreground/[0.04] p-0.5 text-[13px] dark:bg-white/[0.04]">
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-8 rounded-md px-3 font-medium transition-[background-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60",
              active
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(20,10,40,0.08)] ring-1 ring-border dark:bg-white/10 dark:ring-white/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function Feature({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <li className="flex gap-2.5 text-sm leading-snug text-foreground/90">
      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", accent ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground")} strokeWidth={2} />
      <span>{children}</span>
    </li>
  )
}

const btnBase =
  "inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-[transform,opacity,background-color] duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
const btnPrimary = `${btnBase} bg-foreground text-background hover:opacity-90`
const btnSecondary = `${btnBase} border border-border bg-background text-foreground hover:bg-muted`

function Card({ highlight, children }: { highlight?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-6",
        highlight
          ? "border-violet-500/30 bg-violet-500/[0.035] dark:border-violet-400/30 dark:bg-violet-400/[0.06]"
          : "border-border bg-card"
      )}
    >
      {children}
    </div>
  )
}

function Header({ name, note, noteAccent, description }: { name: string; note?: string; noteAccent?: boolean; description: string }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">{name}</h2>
        {note && (
          <span className={cn("text-xs font-medium", noteAccent ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground")}>{note}</span>
        )}
      </div>
      <p className="mt-1.5 text-sm md:min-h-[2.5rem] leading-snug text-muted-foreground">{description}</p>
    </>
  )
}

function Price({ amount, unit, sub }: { amount: number; unit: string; sub: string }) {
  return (
    <div className="mt-5">
      <p className="flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tabular-nums tracking-[-0.03em] text-foreground">${amount}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </p>
      <p className="mt-1 h-5 text-[13px] text-muted-foreground">{sub}</p>
    </div>
  )
}

/** Presentational plan cards. Checkout state and account data come from PricingPlans. */
export default function PlanGrid({
  isSignedIn, hasPro, hasLifetime, billing, onBillingChange, pack, onPackChange, pending, failed, onBuy, discountCode,
}: PlanGridProps) {
  const proPlan: PlanKey = billing === "yearly" ? "pro_yearly" : "pro_monthly"
  const proPrice = PLANS[proPlan].priceUsd
  const packInfo = PLANS[pack]

  const buy = (plan: PlanKey, label: string, className: string) => (
    <button type="button" disabled={pending !== null} onClick={() => onBuy(plan)} className={className}>
      {pending === plan && <Loader2 className="h-4 w-4 animate-spin" />}
      {failed === plan && pending === null ? "Try again" : label}
    </button>
  )

  return (
    <div>
      {discountCode && (
        <p className="mb-5 text-sm text-muted-foreground">
          Code <span className="font-mono font-medium text-foreground">{discountCode}</span> will be applied at checkout.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Header name="Free" description="Try the generator. No card needed." />
          <Price amount={0} unit="forever" sub="Resets every day" />
          <div className="mt-4 hidden h-9 md:block" aria-hidden />
          <Link href="/ai-generate" className={cn(btnSecondary, "mt-5")}>
            {isSignedIn ? "Start creating" : "Sign in to start"}
          </Link>
          <ul className="mt-6 space-y-3 border-t border-border/70 pt-6">
            <Feature>{FREE_PER_DAY} AI wallpapers every day</Feature>
            <Feature>1344 × 768 widescreen PNG</Feature>
            <Feature>The whole wallpaper library, free</Feature>
          </ul>
        </Card>

        <Card>
          <Header name="Credits" description="Pay once, use whenever. No subscription." />
          <Price
            amount={packInfo.priceUsd}
            unit="one-time"
            sub={`${((packInfo.priceUsd / packInfo.credits!) * 100).toFixed(1)}¢ per wallpaper`}
          />
          <div className="mt-4 h-9">
            <Segmented
              label="Credit pack size"
              value={pack}
              onChange={onPackChange}
              options={[
                { value: "credits_50", label: `${PLANS.credits_50.credits} credits` },
                { value: "credits_150", label: `${PLANS.credits_150.credits} credits` },
              ]}
            />
          </div>
          <div className="mt-5">{buy(pack, `Buy ${packInfo.credits} credits`, btnSecondary)}</div>
          <ul className="mt-6 space-y-3 border-t border-border/70 pt-6">
            <Feature>{packInfo.credits} extra AI wallpapers</Feature>
            <Feature>Credits never expire</Feature>
            <Feature>Used only after your free {FREE_PER_DAY} a day</Feature>
            <Feature>Failed generations are refunded automatically</Feature>
          </ul>
        </Card>

        <Card highlight>
          <Header
            name="Pro"
            note={hasPro && !hasLifetime ? "Your plan" : "Most popular"}
            noteAccent
            description="For people who make wallpapers often."
          />
          <Price
            amount={proPrice}
            unit={billing === "yearly" ? "per year" : "per month"}
            sub={billing === "yearly" ? `$${(proPrice / 12).toFixed(2)} a month, billed yearly` : "Billed monthly, cancel anytime"}
          />
          <div className={cn("mt-4 h-9", hasPro && "invisible hidden md:block")} aria-hidden={hasPro || undefined}>
            <Segmented
              label="Billing period"
              value={billing}
              onChange={onBillingChange}
              options={[
                { value: "monthly", label: "Monthly" },
                {
                  value: "yearly",
                  label: (
                    <span>
                      Yearly <span className="text-violet-600 dark:text-violet-400">−{YEARLY_SAVING}%</span>
                    </span>
                  ),
                },
              ]}
            />
          </div>
          <div className="mt-5">
            {hasPro ? (
              <a href="/api/billing/portal" className={btnSecondary}>
                {hasLifetime ? "You have Lifetime" : "Manage billing"}
              </a>
            ) : (
              buy(proPlan, `Go Pro ${billing === "yearly" ? "yearly" : "monthly"}`, btnPrimary)
            )}
          </div>
          <ul className="mt-6 space-y-3 border-t border-violet-500/15 pt-6">
            <Feature accent>{PRO_PER_MONTH} AI wallpapers a month, on top of the free {FREE_PER_DAY} a day</Feature>
            <Feature accent>No ads anywhere on Wallpaperz</Feature>
            <Feature accent>Keeps working when free generations pause on busy days</Feature>
            <Feature accent>Cancel anytime from your billing page</Feature>
          </ul>
        </Card>

        <Card>
          <Header name="Lifetime" note={hasLifetime ? "Your plan" : "Launch price"} noteAccent={hasLifetime} description="Pay once and keep everything in Pro." />
          <Price amount={PLANS.lifetime.priceUsd} unit="one-time" sub="No renewals" />
          <div className="mt-4 hidden h-9 md:block" aria-hidden />
          <div className="mt-5">
            {hasLifetime ? (
              <span className={cn(btnSecondary, "cursor-default hover:bg-background active:scale-100")}>Your plan</span>
            ) : (
              buy("lifetime", "Get Lifetime", btnSecondary)
            )}
          </div>
          <ul className="mt-6 space-y-3 border-t border-border/70 pt-6">
            <Feature>Everything in Pro</Feature>
            <Feature>{PRO_PER_MONTH} AI wallpapers a month (fair use)</Feature>
            <Feature>No ads</Feature>
            <Feature>One payment</Feature>
          </ul>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-10">
        <CheckoutConsent className="max-w-3xl" />
        {isSignedIn && !hasPro && (
          <p className="shrink-0 text-xs text-muted-foreground">
            Bought credits before?{" "}
            <a href="/api/billing/portal" className="font-medium text-foreground underline-offset-4 hover:underline">
              Receipts and billing
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
