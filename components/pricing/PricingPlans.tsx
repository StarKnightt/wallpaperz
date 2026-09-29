"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useAuth, useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Check, Coins, Crown, Infinity as InfinityIcon, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCheckout } from "@/lib/hooks/useCheckout"
import { FREE_PER_DAY, PLANS, PRO_PER_MONTH, isAdFreePlan, isPlanKey, type PlanKey } from "@/lib/pricing"

type Billing = "monthly" | "yearly"
type Pack = "credits_50" | "credits_150"

const YEARLY_SAVING = Math.round((1 - PLANS.pro_yearly.priceUsd / (PLANS.pro_monthly.priceUsd * 12)) * 100)

function Feature({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "pro" | "gold" }) {
  return (
    <li className="flex gap-2.5 text-sm">
      <Check
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0",
          tone === "pro" ? "text-fuchsia-500" : tone === "gold" ? "text-amber-500" : "text-muted-foreground"
        )}
      />
      <span>{children}</span>
    </li>
  )
}

function Segmented<T extends string>({ value, onChange, options, label }: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: React.ReactNode }[]
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border bg-muted/50 p-1 text-sm">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-4 py-1.5 font-medium transition-colors",
            value === o.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function PricingPlans() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { checkout, pending } = useCheckout()
  const [billing, setBilling] = useState<Billing>("yearly")
  const [pack, setPack] = useState<Pack>("credits_150")
  const resumed = useRef(false)

  const currentPlan = user?.publicMetadata?.plan
  const hasPro = isAdFreePlan(currentPlan)
  const hasLifetime = currentPlan === "lifetime"

  // Resume a checkout started before sign-in (/pricing?plan=...), and surface return states.
  useEffect(() => {
    if (!isLoaded || resumed.current) return
    resumed.current = true
    const params = new URLSearchParams(window.location.search)
    const plan = params.get("plan")
    if (params.get("cancelled")) toast("Checkout cancelled. No charge was made.")
    if (params.get("billing") === "none") toast("No active subscription found for this account.")
    if (params.get("billing") === "error") toast.error("Couldn't open billing right now. Please try again.")
    if (params.toString()) window.history.replaceState(null, "", window.location.pathname)
    if (isSignedIn && isPlanKey(plan)) checkout(plan)
  }, [isLoaded, isSignedIn, checkout])

  const proPlan: PlanKey = billing === "yearly" ? "pro_yearly" : "pro_monthly"
  const proPrice = PLANS[proPlan].priceUsd
  const packInfo = PLANS[pack]

  const buyButton = (plan: PlanKey, label: string, className: string, disabled = false) => (
    <button
      type="button"
      disabled={disabled || pending !== null}
      onClick={() => checkout(plan)}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {pending === plan && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  )

  return (
    <div>
      <div className="flex justify-center">
        <Segmented
          label="Billing period"
          value={billing}
          onChange={setBilling}
          options={[
            { value: "monthly", label: "Monthly" },
            {
              value: "yearly",
              label: (
                <span className="inline-flex items-center gap-1.5">
                  Yearly
                  <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Save {YEARLY_SAVING}%
                  </span>
                </span>
              ),
            },
          ]}
        />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Free */}
        <div className="flex flex-col rounded-2xl border bg-card/60 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-1 text-sm text-muted-foreground xl:min-h-10">Try the generator, no card needed.</p>
          <p className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">$0</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            <Feature>{FREE_PER_DAY} AI wallpapers every day</Feature>
            <Feature>1344&times;768 widescreen output</Feature>
            <Feature>Full-quality PNG downloads</Feature>
            <Feature>Browse and download the whole library</Feature>
          </ul>
          <Link
            href="/ai-generate"
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {isSignedIn ? "Start creating" : "Sign in to start"}
          </Link>
        </div>

        {/* Credits */}
        <div className="flex flex-col rounded-2xl border bg-card/60 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-violet-500" />
            <h2 className="text-lg font-semibold">Credit packs</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground xl:min-h-10">Pay once, use whenever. No subscription.</p>
          <p className="mt-6 flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight">${packInfo.priceUsd}</span>
            <span className="text-sm text-muted-foreground">
              one-time &middot; {((packInfo.priceUsd / packInfo.credits!) * 100).toFixed(1)}&cent; each
            </span>
          </p>
          <div className="mt-3">
            <Segmented
              label="Credit pack size"
              value={pack}
              onChange={setPack}
              options={[
                { value: "credits_50", label: "50 credits" },
                { value: "credits_150", label: "150 credits" },
              ]}
            />
          </div>
          <ul className="mt-5 flex-1 space-y-3">
            <Feature>{packInfo.credits} extra AI wallpapers</Feature>
            <Feature>Credits never expire</Feature>
            <Feature>Used only after your free daily {FREE_PER_DAY}</Feature>
            <Feature>Failed generations are refunded automatically</Feature>
          </ul>
          <div className="mt-8">
            {buyButton(pack, `Buy ${packInfo.credits} credits`, "bg-foreground text-background hover:opacity-90")}
          </div>
        </div>

        {/* Pro */}
        <div className="rounded-2xl bg-gradient-to-b from-violet-500 via-fuchsia-500 to-pink-500 p-px shadow-xl shadow-fuchsia-500/15">
          <div className="relative flex h-full flex-col rounded-[15px] bg-card p-6">
            <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white shadow">
              <Sparkles className="h-3 w-3" /> Most popular
            </span>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-fuchsia-500" />
              <h2 className="text-lg font-semibold">Pro</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground xl:min-h-10">For people who make wallpapers often.</p>
            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight">${proPrice}</span>
              <span className="text-sm text-muted-foreground">/{billing === "yearly" ? "year" : "month"}</span>
            </p>
            <p className="mt-1 h-5 text-xs text-muted-foreground">
              {billing === "yearly" ? `That's $${(proPrice / 12).toFixed(2)}/month, billed yearly` : "Billed monthly, cancel anytime"}
            </p>
            <ul className="mt-5 flex-1 space-y-3">
              <Feature tone="pro">{PRO_PER_MONTH} AI wallpapers every month, on top of the free {FREE_PER_DAY}/day</Feature>
              <Feature tone="pro">No ads anywhere on Wallpaperz</Feature>
              <Feature tone="pro">Keeps working when free generations pause on busy days</Feature>
              <Feature tone="pro">Cancel anytime from your billing page</Feature>
            </ul>
            <div className="mt-8">
              {hasPro
                ? (
                  <a
                    href="/api/billing/portal"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    {hasLifetime ? "You have Lifetime" : "Manage billing"}
                  </a>
                )
                : buyButton(
                  proPlan,
                  `Go Pro ${billing === "yearly" ? "yearly" : "monthly"}`,
                  "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/25 hover:-translate-y-0.5 hover:opacity-95"
                )}
            </div>
          </div>
        </div>

        {/* Lifetime */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-amber-500/40 bg-card/60 p-6 backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.18),transparent_70%)]" />
          <div className="relative flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <InfinityIcon className="h-4 w-4 text-amber-500" />
              <h2 className="text-lg font-semibold">Lifetime</h2>
            </div>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              Launch deal
            </span>
          </div>
          <p className="relative mt-1 text-sm text-muted-foreground xl:min-h-10">Pay once. Pro forever.</p>
          <p className="relative mt-6 flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight">${PLANS.lifetime.priceUsd}</span>
            <span className="text-sm text-muted-foreground">one-time</span>
          </p>
          <ul className="relative mt-6 flex-1 space-y-3">
            <Feature tone="gold">Everything in Pro, for life</Feature>
            <Feature tone="gold">{PRO_PER_MONTH} AI wallpapers a month (fair use)</Feature>
            <Feature tone="gold">No ads, ever</Feature>
            <Feature tone="gold">One payment, no renewals</Feature>
          </ul>
          <div className="relative mt-8">
            {hasLifetime
              ? (
                <span className="inline-flex h-11 w-full items-center justify-center rounded-full border bg-background px-5 text-sm font-semibold">
                  Your plan
                </span>
              )
              : buyButton(
                "lifetime",
                "Get Lifetime",
                "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:-translate-y-0.5 hover:opacity-95"
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
