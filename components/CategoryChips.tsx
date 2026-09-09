import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CategoryChipsProps {
  /** Display names, e.g. "Anime" -> /category/anime */
  categories: string[]
  /** Lower-case slug of the active category; undefined highlights "All" */
  activeSlug?: string
  className?: string
}

// Crawlable replacement for the context-driven CategoryFilter: each chip is a
// real link to a prerendered, paginated category page.
export default function CategoryChips({ categories, activeSlug, className }: CategoryChipsProps) {
  const chips = [
    { label: "All", href: "/", slug: undefined as string | undefined },
    ...categories.map((name) => ({ label: name, href: `/category/${name.toLowerCase()}`, slug: name.toLowerCase() })),
    // Orientation pseudo-category with its own landing page (most traffic is phones)
    ...(categories.some((c) => c.toLowerCase() === "mobile")
      ? []
      : [{ label: "Mobile", href: "/category/mobile", slug: "mobile" as string | undefined }]),
  ]

  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-1">
          {chips.map((chip) => {
            const active = chip.slug === activeSlug
            return (
              <Link
                key={chip.label}
                href={chip.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                {chip.label}
              </Link>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  )
}
