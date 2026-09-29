"use client"

import { useCallback, useState } from "react"
import { useAuth, useClerk } from "@clerk/nextjs"
import { toast } from "sonner"
import type { PlanKey } from "@/lib/pricing"

/**
 * Starts a Dodo checkout for `plan`. Signed-out visitors sign in first and come
 * back to /pricing?plan=..., where the pricing page resumes the checkout.
 */
export function useCheckout() {
  const { isSignedIn } = useAuth()
  const clerk = useClerk()
  const [pending, setPending] = useState<PlanKey | null>(null)

  const checkout = useCallback(
    async (plan: PlanKey) => {
      if (!isSignedIn) {
        clerk.openSignIn({ forceRedirectUrl: `/pricing?plan=${plan}`, signUpForceRedirectUrl: `/pricing?plan=${plan}` })
        return
      }
      setPending(plan)
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
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
      setPending(null)
    },
    [isSignedIn, clerk]
  )

  return { checkout, pending }
}
