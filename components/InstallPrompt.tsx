"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Share, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBottomAnchorAd } from "@/lib/hooks/useBottomAnchorAd"

// Mobile-only "Install app" banner.
//
// Rules
// - Never on first paint: shows after the 2nd page view in this tab session OR
//   after 15s on the page, whichever comes first.
// - Only when the browser can actually install: Chromium fires
//   `beforeinstallprompt` (we stash it and call prompt() on tap); iOS Safari has
//   no such event, so it gets the same card with Share -> "Add to Home Screen".
// - Never when already installed (display-mode: standalone / `appinstalled`).
// - "Not now" snoozes it for 30 days (localStorage `pwa-dismissed-at`).
// - Sits above BottomNav and hides itself while an AdSense bottom anchor ad is
//   displayed, exactly like BottomNav does.
// - Desktop gets nothing; Chrome's own address-bar install icon is enough.

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const DISMISSED_KEY = "pwa-dismissed-at"
const INSTALLED_KEY = "pwa-installed"
const PAGEVIEWS_KEY = "pwa-pv"
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000
const ENGAGEMENT_DELAY_MS = 15_000
const ENGAGEMENT_PAGEVIEWS = 2

type Variant = "native" | "ios"

function track(event: string, params?: Record<string, string>) {
  if (typeof window.gtag === "function") window.gtag("event", event, params)
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isMobileViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  // Chrome/Firefox/Edge/Opera/DuckDuckGo on iOS all include "Safari" in the UA
  // but can't add to Home Screen from a web prompt, so exclude them.
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|Chrome/i.test(ua)
  return isIOS && isSafari
}

function isEligible(): boolean {
  try {
    if (isStandalone()) {
      localStorage.setItem(INSTALLED_KEY, "1")
      return false
    }
    if (localStorage.getItem(INSTALLED_KEY)) return false
    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0)
    if (dismissedAt && Date.now() - dismissedAt < SNOOZE_MS) return false
    return true
  } catch {
    return false
  }
}

export default function InstallPrompt() {
  const pathname = usePathname()
  const hiddenByAnchorAd = useBottomAnchorAd()

  const [eligible, setEligible] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const [variant, setVariant] = useState<Variant | null>(null)
  const [closed, setClosed] = useState(false)
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const shownTracked = useRef(false)

  // One-time eligibility + capability detection.
  useEffect(() => {
    if (!isEligible()) return
    setEligible(true)

    if (isIosSafari()) setVariant("ios")

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setVariant("native")
    }
    const onInstalled = () => {
      try { localStorage.setItem(INSTALLED_KEY, "1") } catch {}
      deferredPrompt.current = null
      setClosed(true)
      track("pwa_installed")
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onInstalled)

    const timer = window.setTimeout(() => setEngaged(true), ENGAGEMENT_DELAY_MS)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onInstalled)
      window.clearTimeout(timer)
    }
  }, [])

  // Count page views for this tab session; the 2nd one counts as engagement.
  useEffect(() => {
    try {
      const views = Number(sessionStorage.getItem(PAGEVIEWS_KEY) || 0) + 1
      sessionStorage.setItem(PAGEVIEWS_KEY, String(views))
      if (views >= ENGAGEMENT_PAGEVIEWS) setEngaged(true)
    } catch {}
  }, [pathname])

  const visible = eligible && engaged && variant !== null && !closed && !hiddenByAnchorAd

  useEffect(() => {
    if (!visible || shownTracked.current || !isMobileViewport()) return
    shownTracked.current = true
    track("pwa_install_prompt_shown", { variant: variant ?? "unknown" })
  }, [visible, variant])

  const dismiss = useCallback(() => {
    try { localStorage.setItem(DISMISSED_KEY, String(Date.now())) } catch {}
    setClosed(true)
    track("pwa_prompt_dismissed", { variant: variant ?? "unknown" })
  }, [variant])

  const install = useCallback(async () => {
    const evt = deferredPrompt.current
    if (!evt) return
    deferredPrompt.current = null
    try {
      await evt.prompt()
      const { outcome } = await evt.userChoice
      if (outcome === "accepted") {
        setClosed(true) // `appinstalled` handles storage + analytics
      } else {
        dismiss()
      }
    } catch {
      dismiss()
    }
  }, [dismiss])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Install Wallpaperz"
      data-testid="pwa-install-banner"
      data-variant={variant}
      className={cn(
        "md:hidden fixed inset-x-3 bottom-[4.25rem] z-40",
        "rounded-2xl border bg-background/95 backdrop-blur-md shadow-xl shadow-black/20",
        "p-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
      )}
    >
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static icon, no optimizer needed */}
        <img
          src="/web-app-manifest-192x192-maskable.png"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold leading-tight">Install Wallpaperz</p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            Free 4K wallpapers, one tap from your home screen
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Not now"
          className="-mr-1 -mt-1 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {variant === "native" ? (
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" className="h-9 flex-1 rounded-full font-semibold" onClick={install}>
            Install
          </Button>
          <Button size="sm" variant="ghost" className="h-9 rounded-full px-4" onClick={dismiss}>
            Not now
          </Button>
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          <span>Tap</span>
          <Share className="h-3.5 w-3.5 shrink-0 text-foreground" aria-hidden />
          <span>
            <span className="font-medium text-foreground">Share</span>, then{" "}
            <span className="font-medium text-foreground">&ldquo;Add to Home Screen&rdquo;</span>
          </span>
        </p>
      )}
    </div>
  )
}
