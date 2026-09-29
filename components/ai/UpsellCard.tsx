"use client"

import Link from "next/link"
import { Coins, Crown, Loader2, X } from "lucide-react"
import { useCheckout } from "@/lib/hooks/useCheckout"
import { PLANS, PRO_PER_MONTH, type LimitCode, type PlanKey } from "@/lib/pricing"

export default function UpsellCard({ code, message, resetTime, onDismiss }: {
  code: Exclude<LimitCode, "PAID_GLOBAL_LIMIT">
  message: string
  resetTime: string | null
  onDismiss: () => void
}) {
  const { checkout, pending } = useCheckout()
  const creditPlan: PlanKey = code === "PRO_LIMIT" ? "credits_150" : "credits_50"
  const refill = code === "FREE_LIMIT" && resetTime
    ? new Date(resetTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 p-px shadow-lg shadow-fuchsia-500/10">
      <div className="relative rounded-[15px] bg-card p-5">
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="pr-8 font-semibold">
          {code === "PRO_LIMIT" ? "You've used this month's Pro generations" : "Keep the ideas coming"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        {refill && <p className="mt-1 text-xs text-muted-foreground">Free generations start refilling at {refill}.</p>}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => checkout(creditPlan)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending === creditPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
            {PLANS[creditPlan].credits} credits &middot; ${PLANS[creditPlan].priceUsd}
          </button>
          {code !== "PRO_LIMIT" && (
            <button
              type="button"
              disabled={pending !== null}
              onClick={() => checkout("pro_monthly")}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-4 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              {pending === "pro_monthly" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
              Pro &middot; {PRO_PER_MONTH}/mo for ${PLANS.pro_monthly.priceUsd}
            </button>
          )}
        </div>
        <Link href="/pricing" className="mt-3 inline-block text-xs font-medium text-fuchsia-500 hover:underline">
          Compare all plans, including the ${PLANS.lifetime.priceUsd} lifetime deal &rarr;
        </Link>
      </div>
    </div>
  )
}
