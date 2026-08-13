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
    if (ALLOWED_HOSTNAMES.includes(window.location.hostname)) {
      setAllowed(true)
    }
  }, [])

  if (!allowed) return null

  return (
    <>
      {/* AdSense Auto ads: loading this script is all that's needed (no manual units) */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
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
