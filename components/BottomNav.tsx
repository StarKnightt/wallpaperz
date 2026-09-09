"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Sparkles, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// AdSense anchor ads are `ins.adsbygoogle[data-anchor-status]` elements that Google
// appends to <body> with position:fixed and z-index 2147483647. When one is shown at
// the bottom edge it sits on top of this nav and makes it untappable, so we hide the
// nav for as long as that anchor is displayed. Top anchors and dismissed/collapsed
// anchors leave the nav alone.
function useBottomAnchorAd(): boolean {
  const [covered, setCovered] = useState(false)

  useEffect(() => {
    const isAnchor = (node: Node): node is HTMLElement =>
      node instanceof HTMLElement && node.tagName === "INS" && node.classList.contains("adsbygoogle")

    const check = () => {
      let found = false
      for (const el of document.body.querySelectorAll<HTMLElement>(":scope > ins.adsbygoogle")) {
        if (el.dataset.anchorStatus !== "displayed") continue
        const r = el.getBoundingClientRect()
        // Anchored to the bottom edge (top anchors start at y=0 and are ignored)
        if (r.height > 0 && r.top > 0 && r.bottom >= window.innerHeight - 1) {
          found = true
          break
        }
      }
      setCovered(found)
    }

    // Google flips data-anchor-status / inline style on the ins itself
    const attrObserver = new MutationObserver(check)
    const watch = (el: HTMLElement) =>
      attrObserver.observe(el, { attributes: true, attributeFilter: ["data-anchor-status", "style"] })

    // ...and the ins is appended to <body> only after the ad script decides to show one
    const bodyObserver = new MutationObserver((records) => {
      let changed = false
      for (const rec of records) {
        rec.addedNodes.forEach((n) => { if (isAnchor(n)) { watch(n); changed = true } })
        rec.removedNodes.forEach((n) => { if (isAnchor(n)) changed = true })
      }
      if (changed) check()
    })
    bodyObserver.observe(document.body, { childList: true })
    document.body.querySelectorAll<HTMLElement>(":scope > ins.adsbygoogle").forEach(watch)

    window.addEventListener("resize", check)
    check()
    return () => {
      attrObserver.disconnect()
      bodyObserver.disconnect()
      window.removeEventListener("resize", check)
    }
  }, [])

  return covered
}

export default function BottomNav() {
  const pathname = usePathname()
  const hiddenByAnchorAd = useBottomAnchorAd()
  
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'AI Generate',
      href: '/ai-generate',
      icon: Sparkles
    },
    {
      name: 'About',
      href: '/about',
      icon: Info
    }
  ]

  return (
    <div
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t transition-transform duration-200",
        hiddenByAnchorAd && "translate-y-full pointer-events-none"
      )}
      aria-hidden={hiddenByAnchorAd || undefined}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 min-w-[4rem]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 mb-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 