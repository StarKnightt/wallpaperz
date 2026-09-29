"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { useCheckout } from "@/lib/hooks/useCheckout"
import { useEntitlements } from "@/lib/hooks/useEntitlements"
import { isAdFreePlan, isPlanKey } from "@/lib/pricing"
import PlanGrid, { type Billing, type Pack } from "@/components/pricing/PlanGrid"

export default function PricingPlans() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { checkout, pending, failed } = useCheckout()
  const [billing, setBilling] = useState<Billing>("yearly")
  const [pack, setPack] = useState<Pack>("credits_150")
  const [discountCode, setDiscountCode] = useState<string | undefined>()
  const resumed = useRef(false)
  const { entitlements } = useEntitlements(!!isSignedIn)

  const currentPlan = user?.publicMetadata?.plan
  const hasPro = isAdFreePlan(currentPlan)
  const hasLifetime = currentPlan === "lifetime"

  // The entitlements call repairs a stale publicMetadata.plan server-side; reload to pick it up.
  const planReloaded = useRef(false)
  useEffect(() => {
    if (!entitlements || !user || planReloaded.current) return
    const actual = entitlements.plan === "free" ? "" : entitlements.plan
    if (actual !== (typeof currentPlan === "string" ? currentPlan : "")) {
      planReloaded.current = true
      user.reload().catch(() => {})
    }
  }, [entitlements, user, currentPlan])

  // Resume a checkout started before sign-in (/pricing?plan=...), pick up ?code=, and surface return states.
  useEffect(() => {
    if (!isLoaded || resumed.current) return
    resumed.current = true
    const params = new URLSearchParams(window.location.search)
    const plan = params.get("plan")
    const code = params.get("code")?.trim() || undefined
    if (code) setDiscountCode(code)
    if (params.get("cancelled")) toast("Checkout cancelled. No charge was made.")
    if (params.get("billing") === "none") toast("No purchases found for this account yet.")
    if (params.get("billing") === "error") toast.error("Couldn't open billing right now. Please try again.")
    if (params.toString()) window.history.replaceState(null, "", window.location.pathname)
    if (isSignedIn && isPlanKey(plan)) checkout(plan, code)
  }, [isLoaded, isSignedIn, checkout])

  return (
    <PlanGrid
      isSignedIn={!!isSignedIn}
      hasPro={hasPro}
      hasLifetime={hasLifetime}
      billing={billing}
      onBillingChange={setBilling}
      pack={pack}
      onPackChange={setPack}
      pending={pending}
      failed={failed}
      onBuy={(plan) => checkout(plan, discountCode)}
      discountCode={discountCode}
    />
  )
}
