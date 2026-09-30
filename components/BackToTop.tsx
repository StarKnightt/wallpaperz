"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBottomAnchorAdHeight } from "@/lib/hooks/useBottomAnchorAd"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const anchorAdHeight = useBottomAnchorAdHeight()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setVisible(window.scrollY > Math.max(600, window.innerHeight))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" })
    document.getElementById("main-content")?.focus({ preventScroll: true })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible || undefined}
      tabIndex={visible ? 0 : -1}
      data-testid="back-to-top"
      style={{ "--anchor-ad": `${anchorAdHeight}px` } as CSSProperties}
      className={cn(
        "fixed z-40 right-[calc(1rem+env(safe-area-inset-right))] lg:right-[calc(1.5rem+env(safe-area-inset-right))]",
        // Above the mobile BottomNav, which hides itself while a bottom anchor ad shows.
        anchorAdHeight
          ? "bottom-[calc(1rem+var(--anchor-ad))]"
          : "bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]",
        // The mobile PWA install banner spans the same strip above BottomNav.
        "max-md:[body:has([data-testid=pwa-install-banner])_&]:hidden",
        "grid h-11 w-11 cursor-pointer place-items-center rounded-full",
        "border border-border bg-background/80 text-foreground shadow-lg shadow-black/10 backdrop-blur-md dark:shadow-black/40",
        "transition-[opacity,transform,background-color,color] duration-300 ease-out motion-reduce:transition-none",
        "hover:bg-accent hover:text-accent-foreground active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </button>
  )
}
