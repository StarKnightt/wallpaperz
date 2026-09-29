"use client"

import { useEffect, useState } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { useUser } from "@clerk/nextjs"
import { isAdFreePlan } from "@/lib/pricing"
import { CONSENT_REGIONS, COUNTRY_COOKIE } from "@/lib/consent"

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

// Publisher ID is public by nature (it's served in /ads.txt); the protection
// against clones is the hostname gate above, not secrecy of the ID.
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9812963383908086"

// If Clerk hasn't loaded by then (blocked, slow network), serve ads anyway,
// unless Clerk's session cookie says someone is signed in (could be Pro).
const CLERK_WAIT_MS = 4000

const CLARITY_ID = "q9tt7wi9dk"
// Poll for Google's CMP every 500ms for up to 30s (AdSense itself may wait for Clerk).
const TCF_WAIT_TRIES = 60

function hasClerkSession() {
  const m = document.cookie.match(/(?:^|;\s*)__client_uat(?:_[^=]+)?=([^;]*)/)
  return !!m && m[1] !== "0" && m[1] !== ""
}

type AdsQueue = unknown[] & { pauseAdRequests?: number }

// Injected by hand rather than via next/script: AdSense warns about the
// data-nscript attribute next/script adds, and the module beacon's
// next/script preload is fetched without CORS so the browser discards it.
function addScript(attrs: Record<string, string>) {
  if (document.querySelector(`script[src="${attrs.src}"]`)) return
  const s = document.createElement("script")
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  s.async = true
  document.head.appendChild(s)
}

type TcfData = { eventStatus?: string; gdprApplies?: boolean; purpose?: { consents?: Record<string, boolean> } }
type TcfApi = (cmd: string, version: number, cb: (data: TcfData, success: boolean) => void) => void
type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] }

function inConsentRegion() {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${COUNTRY_COOKIE}=([A-Z0-9]{2})`))
  if (m && m[1] !== "XX" && m[1] !== "T1") return CONSENT_REGIONS.includes(m[1])
  // No usable edge hint (local dev, Tor, cookie blocked): guess from the time
  // zone, erring towards asking for consent.
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    return /^(Europe|Arctic)\//.test(tz) || /^Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$/.test(tz) || tz === "UTC" || tz.startsWith("Etc/")
  } catch {
    return true
  }
}

function loadClarity() {
  const w = window as unknown as { clarity?: ClarityFn }
  if (!w.clarity) {
    const fn: ClarityFn = (...args: unknown[]) => { (fn.q = fn.q || []).push(args) }
    w.clarity = fn
  }
  addScript({ src: `https://www.clarity.ms/tag/${CLARITY_ID}` })
  return w.clarity!
}

// Google's CMP exposes the TCF API once it loads (it's pulled in by the AdSense
// script). Purpose 1 (store/access information on a device) gates Clarity.
// No CMP within the wait (Pro member, blocker) means no Clarity.
function onTcfAnalyticsConsent(onChange: (granted: boolean) => void) {
  let tries = 0
  let timer: ReturnType<typeof setTimeout>
  let active = true
  const attach = () => {
    const tcf = (window as unknown as { __tcfapi?: TcfApi }).__tcfapi
    if (!tcf) {
      if (++tries < TCF_WAIT_TRIES) timer = setTimeout(attach, 500)
      return
    }
    tcf("addEventListener", 2, (data, success) => {
      if (!active || !success) return
      if (data.eventStatus !== "tcloaded" && data.eventStatus !== "useractioncomplete") return
      onChange(data.gdprApplies === false || !!data.purpose?.consents?.[1])
    })
  }
  attach()
  return () => {
    active = false
    clearTimeout(timer)
  }
}

export default function DomainGatedScripts() {
  const [allowed, setAllowed] = useState(false)
  const [clerkWaitOver, setClerkWaitOver] = useState(false)
  const { isLoaded, user } = useUser()
  // Set by the Dodo webhook for Pro/Lifetime members.
  const adFree = isAdFreePlan(user?.publicMetadata?.plan)

  useEffect(() => {
    if (!ALLOWED_HOSTNAMES.includes(window.location.hostname)) return
    setAllowed(true)

    // Cloudflare Web Analytics (RUM) beacon, manual setup: reports to
    // cloudflareinsights.com. Automatic edge injection is turned off for this
    // zone because it reports to /cdn-cgi/rum, which 404s on Workers domains.
    addScript({
      src: "https://static.cloudflareinsights.com/beacon.min.js",
      "data-cf-beacon": '{"token": "5d0b9c1fc2e14572b69d581aa56c39b2"}',
      defer: "",
    })

    // Microsoft Clarity: straight away outside consent regions; inside them only
    // after the CMP reports consent, and consent withdrawal is passed on.
    let stopTcf = () => {}
    if (!inConsentRegion()) {
      loadClarity()
    } else {
      stopTcf = onTcfAnalyticsConsent((granted) => {
        const w = window as unknown as { clarity?: ClarityFn }
        if (granted) loadClarity()("consent")
        else w.clarity?.("consent", false)
      })
    }

    const t = setTimeout(() => setClerkWaitOver(!hasClerkSession()), CLERK_WAIT_MS)
    return () => {
      clearTimeout(t)
      stopTcf()
    }
  }, [])

  // AdSense Auto ads: loading this script is all that's needed (no manual units).
  // Waits for Clerk so Pro members never load it.
  useEffect(() => {
    const w = window as unknown as { adsbygoogle?: AdsQueue }
    if (adFree) {
      // Upgraded mid-session after the script already loaded: stop further ad requests.
      if (w.adsbygoogle) w.adsbygoogle.pauseAdRequests = 1
      return
    }
    if (!allowed || (!isLoaded && !clerkWaitOver)) return
    if (w.adsbygoogle?.pauseAdRequests) w.adsbygoogle.pauseAdRequests = 0
    addScript({
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`,
      crossorigin: "anonymous",
    })
  }, [allowed, adFree, isLoaded, clerkWaitOver])

  if (!allowed) return null

  // GA4 honours the Consent Mode defaults set in the layout <head>.
  return <GoogleAnalytics gaId="G-FY8FQN2G9Z" />
}
