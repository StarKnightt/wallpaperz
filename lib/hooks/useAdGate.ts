"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { isAdFreePlan } from "@/lib/pricing"

// Hostname allowlist: the repo is public and gets cloned/redeployed by others.
// Gating ad/analytics scripts on our hostnames means a clone's deployment never
// fires ad requests or analytics hits attributed to our AdSense/GA/Clarity IDs.
// localhost is included so local dev behaves like production.
const ALLOWED_HOSTNAMES = [
  "wallpaperz.in",
  "www.wallpaperz.in",
  "localhost",
  "127.0.0.1",
]

// If Clerk hasn't loaded by then (blocked, slow network), serve ads anyway,
// unless Clerk's session cookie says someone is signed in (could be Pro).
const CLERK_WAIT_MS = 4000

function hasClerkSession() {
  const m = document.cookie.match(/(?:^|;\s*)__client_uat(?:_[^=]+)?=([^;]*)/)
  return !!m && m[1] !== "0" && m[1] !== ""
}

/**
 * Shared gate for everything ad-related (AdSense, the sponsor slot).
 * `allowed`: running on one of our hostnames.
 * `adFree`: signed in with a Pro/Lifetime plan (set by the Dodo webhook).
 * `showAds`: safe to load ads now. Waits for Clerk so paid members never load them.
 */
export function useAdGate() {
  const [allowed, setAllowed] = useState(false)
  const [clerkWaitOver, setClerkWaitOver] = useState(false)
  const { isLoaded, user } = useUser()
  const adFree = isAdFreePlan(user?.publicMetadata?.plan)

  useEffect(() => {
    if (!ALLOWED_HOSTNAMES.includes(window.location.hostname)) return
    setAllowed(true)
    const t = setTimeout(() => setClerkWaitOver(!hasClerkSession()), CLERK_WAIT_MS)
    return () => clearTimeout(t)
  }, [])

  return { allowed, adFree, showAds: allowed && !adFree && (isLoaded || clerkWaitOver) }
}
