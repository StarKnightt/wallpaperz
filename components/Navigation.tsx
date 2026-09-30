"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()

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
      name: 'Pricing',
      href: '/pricing',
    },
    {
      name: 'Blog',
      href: '/blog',
    },
    {
      name: 'About',
      href: '/about',
    },
  ]

  return (
    <nav className="flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex lg:gap-x-4 xl:gap-x-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'whitespace-nowrap text-sm font-semibold leading-6 transition-colors',
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
      <div className="space-y-2 py-6 lg:hidden">
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
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  )
} 