"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"

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

export default function DomainGatedScripts() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (!ALLOWED_HOSTNAMES.includes(window.location.hostname)) return
    setAllowed(true)

    // Injected by hand rather than via next/script: AdSense warns about the
    // data-nscript attribute next/script adds, and the module beacon's
    // next/script preload is fetched without CORS so the browser discards it.
    const add = (attrs: Record<string, string>) => {
      if (document.querySelector(`script[src="${attrs.src}"]`)) return
      const s = document.createElement("script")
      for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
      s.async = true
      document.head.appendChild(s)
    }
    // AdSense Auto ads: loading this script is all that's needed (no manual units)
    add({
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`,
      crossorigin: "anonymous",
    })
    // Cloudflare Web Analytics (RUM) beacon, manual setup: reports to
    // cloudflareinsights.com. Automatic edge injection is turned off for this
    // zone because it reports to /cdn-cgi/rum, which 404s on Workers domains.
    add({
      src: "https://static.cloudflareinsights.com/beacon.min.js",
      "data-cf-beacon": '{"token": "5d0b9c1fc2e14572b69d581aa56c39b2"}',
      defer: "",
    })
  }, [])

  if (!allowed) return null

  return (
    <>
      <GoogleAnalytics gaId="G-FY8FQN2G9Z" />
      <Script strategy="afterInteractive" id="microsoft-clarity">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "q9tt7wi9dk");
        `}
      </Script>
    </>
  )
}
