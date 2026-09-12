"use client"

import { useEffect } from "react"

// Registers /sw.js once the page has loaded. Production only: in dev the SW would
// keep serving stale hashed chunks across HMR rebuilds. On a previously-registered
// non-production origin (e.g. someone ran a prod build on localhost) we also
// unregister so nothing lingers.
export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()))
      return
    }

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => { /* SW is an enhancement; ignore failures */ })
    }

    if (document.readyState === "complete") register()
    else window.addEventListener("load", register, { once: true })
    return () => window.removeEventListener("load", register)
  }, [])

  return null
}
