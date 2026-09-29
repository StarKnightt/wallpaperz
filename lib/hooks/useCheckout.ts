"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth, useClerk } from "@clerk/nextjs"
import { toast } from "sonner"
import type { PlanKey } from "@/lib/pricing"

/**
 * Starts a Dodo checkout for `plan`, optionally with a discount code. Signed-out
 * visitors sign in first and come back to /pricing?plan=...&code=..., where the
 * pricing page resumes the checkout. `failed` is the plan whose last attempt
 * errored, so its button can offer "Try again".
 */
export function useCheckout() {
  const { isSignedIn } = useAuth()
  const clerk = useClerk()
  const [pending, setPending] = useState<PlanKey | null>(null)
  const [failed, setFailed] = useState<PlanKey | null>(null)

  // Back/forward from the Dodo page restores this page from bfcache with the spinner still on.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setPending(null)
    }
    window.addEventListener("pageshow", onPageShow)
    return () => window.removeEventListener("pageshow", onPageShow)
  }, [])

  const checkout = useCallback(
    async (plan: PlanKey, discountCode?: string) => {
      if (!isSignedIn) {
        const back = `/pricing?plan=${plan}${discountCode ? `&code=${encodeURIComponent(discountCode)}` : ""}`
        clerk.openSignIn({ forceRedirectUrl: back, signUpForceRedirectUrl: back })
        return
      }
      setPending(plan)
      setFailed(null)
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discountCode ? { plan, discountCode } : { plan }),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.url) {
          window.location.href = data.url
          return
        }
        toast.error(data.error || "Could not start checkout. Please try again.")
      } catch {
        toast.error("Could not start checkout. Please try again.")
      }
      setFailed(plan)
      setPending(null)
    },
    [isSignedIn, clerk]
  )

  return { checkout, pending, failed }
}
