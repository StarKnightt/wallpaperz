"use client"

import Link from "next/link"
import { Coins, Crown, Infinity as InfinityIcon, Sparkles } from "lucide-react"
import type { Entitlements } from "@/lib/pricing"

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md sm:text-sm">
      {children}
    </span>
  )
}

export default function UsageBar({ entitlements }: { entitlements: Entitlements | null }) {
  if (!entitlements) return <div className="h-7" aria-hidden />
  const { plan, free, pro, credits } = entitlements

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {plan !== "free" && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white shadow-sm sm:text-sm">
          {plan === "lifetime" ? <InfinityIcon className="h-3.5 w-3.5" /> : <Crown className="h-3.5 w-3.5" />}
          {plan === "lifetime" ? "Lifetime" : "Pro"}
        </span>
      )}
      <Pill>
        <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" />
        <span className="tabular-nums">{free.remaining}</span> of {free.limit} free left today
      </Pill>
      {pro && (
        <Pill>
          <Crown className="h-3.5 w-3.5 text-violet-500" />
          <span className="tabular-nums">{pro.remaining}</span> of {pro.limit} Pro left this month
        </Pill>
      )}
      {(credits > 0 || plan === "free") && (
        <Pill>
          <Coins className="h-3.5 w-3.5 text-amber-500" />
          <span className="tabular-nums">{credits}</span> {credits === 1 ? "credit" : "credits"}
        </Pill>
      )}
      {plan === "free" && (
        <Link href="/pricing" className="text-xs font-medium text-fuchsia-500 hover:underline sm:text-sm">
          Get more &rarr;
        </Link>
      )}
    </div>
  )
}
