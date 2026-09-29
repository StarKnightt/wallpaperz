"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import type { Entitlements } from "@/lib/pricing"

/**
 * Back from Dodo checkout (?paid=1): the webhook may land a few seconds later,
 * so poll entitlements and only confirm once the purchase actually shows up.
 * `onChanged` runs after a confirmed change.
 */
export function usePaymentReturn(
  enabled: boolean,
  refresh: () => Promise<Entitlements | null>,
  onChanged?: () => void
) {
  const { user } = useUser()
  const latest = useRef({ refresh, user, onChanged })
  useEffect(() => {
    latest.current = { refresh, user, onChanged }
  }, [refresh, user, onChanged])
  const handled = useRef(false)

  useEffect(() => {
    if (!enabled || handled.current || !new URLSearchParams(window.location.search).has("paid")) return
    handled.current = true
    window.history.replaceState(null, "", window.location.pathname)
    ;(async () => {
      const before = await latest.current.refresh()
      let changed = false
      for (let i = 0; i < 8 && !changed; i++) {
        await new Promise((r) => setTimeout(r, 2500))
        const now = await latest.current.refresh()
        changed = !!now && !!before && (now.credits > before.credits || now.plan !== before.plan)
      }
      if (!changed) {
        toast("Your payment is still processing. It can take a minute to show up. Refresh this page shortly.")
        return
      }
      toast.success("Payment received. Thanks for supporting Wallpaperz!")
      latest.current.onChanged?.()
      // Picks up publicMetadata.plan so ads switch off for Pro.
      await latest.current.user?.reload()
    })()
  }, [enabled])
}
