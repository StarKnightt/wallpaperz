"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import type { Entitlements } from "@/lib/pricing"

export function useEntitlements(enabled: boolean) {
  const { user } = useUser()
  const [data, setData] = useState<Entitlements | null>(null)
  const clerkPlan = typeof user?.publicMetadata?.plan === "string" ? user.publicMetadata.plan : ""

  const refresh = useCallback(async (): Promise<Entitlements | null> => {
    try {
      // clerkPlan lets the server repair a stale publicMetadata.plan.
      const res = await fetch(`/api/me/entitlements?clerkPlan=${encodeURIComponent(clerkPlan)}`, { cache: "no-store" })
      if (!res.ok) return null
      const next = (await res.json()) as Entitlements
      setData(next)
      return next
    } catch {
      return null
    }
  }, [clerkPlan])

  useEffect(() => {
    if (enabled) refresh()
  }, [enabled, refresh])

  return { entitlements: data, setEntitlements: setData, refresh }
}
