"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useAdGate } from "@/lib/hooks/useAdGate"
import { ADSENSE_ID } from "@/lib/ads"

interface Props {
  slot: string
  className?: string
}

// Manual responsive display unit. Same gate as the AdSense script, so Pro/Lifetime
// members never get the <ins>. Keyed on the pathname: soft navigations keep this
// component mounted, and Auto ads never re-scans after one, so each route needs a
// fresh <ins> and its own push(). Never place one next to a download button.
export default function AdUnit({ slot, className = "" }: Props) {
  const { showAds } = useAdGate()
  const pathname = usePathname()
  if (!slot || !showAds) return null
  return <AdSlot key={pathname} slot={slot} className={className} />
}

function AdSlot({ slot, className }: Props) {
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    // Pushing twice for one <ins> throws "All 'ins' elements ... already have ads"
    // (Strict Mode runs effects twice in dev).
    if (pushed.current || !ref.current || ref.current.dataset.adsbygoogleStatus) return
    pushed.current = true
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] }
      ;(w.adsbygoogle = w.adsbygoogle || []).push({})
    } catch {
      // Blocked or not yet ready: the slot just stays empty.
    }
  }, [])

  // Collapses via .ad-unit:has([data-ad-status="unfilled"]) in globals.css.
  return (
    <aside aria-label="Advertisement" className={`ad-unit w-full ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground/70">Advertisement</p>
      <ins
        ref={ref}
        className="adsbygoogle block min-h-[250px] w-full"
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  )
}
