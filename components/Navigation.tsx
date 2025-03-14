"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'AI Generate',
      href: '/ai-generate',
    },
    {
      name: 'Gallery',
      href: '/gallery',
    },
    {
      name: 'About',
      href: '/about',
    },
  ]

  return (
    <nav className="flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:gap-x-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'text-sm font-semibold leading-6 transition-colors',
              pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="space-y-2 py-6 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7',
              pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  )
} 