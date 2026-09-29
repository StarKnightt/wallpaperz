"use client"

import Link from "next/link"
import { Loader2, X } from "lucide-react"
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
    <div role="alert" className="relative rounded-xl border border-violet-500/25 bg-violet-500/[0.04] p-5 dark:bg-violet-400/[0.06]">
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
      <h3 className="pr-8 text-[15px] font-semibold text-foreground">
        {code === "PRO_LIMIT" ? "You've used this month's Pro generations" : "Keep the ideas coming"}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {message}
        {refill && <> Free generations refill at {refill}.</>}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {code !== "PRO_LIMIT" && (
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => checkout("pro_monthly")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97] disabled:opacity-60"
          >
            {pending === "pro_monthly" && <Loader2 className="h-4 w-4 animate-spin" />}
            Go Pro: {PRO_PER_MONTH}/mo for ${PLANS.pro_monthly.priceUsd}
          </button>
        )}
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => checkout(creditPlan)}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-[transform,opacity,background-color] duration-150 ease-out active:scale-[0.97] disabled:opacity-60 ${
            code === "PRO_LIMIT"
              ? "bg-foreground text-background hover:opacity-90"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {pending === creditPlan && <Loader2 className="h-4 w-4 animate-spin" />}
          {PLANS[creditPlan].credits} credits for ${PLANS[creditPlan].priceUsd}
        </button>
      </div>
      <Link href="/pricing" className="mt-3 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        Compare plans, including ${PLANS.lifetime.priceUsd} lifetime
      </Link>
    </div>
  )
}
