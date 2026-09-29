"use client"

import Link from "next/link"
import type { Entitlements } from "@/lib/pricing"

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="font-medium tabular-nums text-foreground">{value}</span> {label}
    </span>
  )
}

export default function UsageBar({ entitlements }: { entitlements: Entitlements | null }) {
  if (!entitlements) {
    return <div className="h-5 w-56 animate-pulse rounded bg-muted" aria-hidden />
  }
  const { plan, free, pro, credits } = entitlements

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
      {plan !== "free" && (
        <span className="font-medium text-violet-600 dark:text-violet-400">{plan === "lifetime" ? "Lifetime" : "Pro"}</span>
      )}
      <Stat value={`${free.remaining}/${free.limit}`} label="free today" />
      {pro && <Stat value={`${pro.remaining}/${pro.limit}`} label="Pro this month" />}
      {(credits > 0 || plan === "free") && <Stat value={credits} label={credits === 1 ? "credit" : "credits"} />}
      {plan === "free" && (
        <Link href="/pricing" className="font-medium text-foreground underline-offset-4 hover:underline">
          Get more
        </Link>
      )}
    </div>
  )
}
