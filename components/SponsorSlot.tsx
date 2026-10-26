"use client"

import Script from "next/script"
import { useAdGate } from "@/lib/hooks/useAdGate"

const SPONSOR_SITE_ID = "C74APtwF62OP"

// SponsorAnySite "Under the menu" slot. Same gate as AdSense, so Pro/Lifetime
// members never get the div or the embed script. The slot stays empty until a
// sponsor books it; empty:hidden keeps it at zero height (and drops its margin)
// until then.
export default function SponsorSlot() {
  const { showAds } = useAdGate()
  if (!showAds) return null

  return (
    <div className="container mx-auto px-4">
      <div data-sponsoranysite={SPONSOR_SITE_ID} className="empty:hidden mt-3" />
      <Script src="https://sponsoranysite.com/embed.js" strategy="afterInteractive" />
    </div>
  )
}
