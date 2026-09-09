import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { pageHref } from "@/lib/pagination"

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** List root, e.g. "/", "/category/anime", "/color/dark" */
  basePath: string
  className?: string
}

// Page numbers to show on sm+ screens: all of them up to 7, otherwise
// first/last, the current page +-1, and ellipses (null) in the gaps.
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current - 1, current, current + 1])
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | null)[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null)
    out.push(p)
  })
  return out
}

// Server-renderable: plain <Link> anchors so every page is crawlable, and
// big Prev/Next targets first because most traffic is on phones.
export default function Pagination({ currentPage, totalPages, basePath, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const prev = currentPage > 1 ? pageHref(basePath, currentPage - 1) : null
  const next = currentPage < totalPages ? pageHref(basePath, currentPage + 1) : null
  const disabled = "pointer-events-none opacity-40"

  return (
    <nav aria-label="Pagination" className={cn("flex flex-col items-center gap-4", className)}>
      <div className="flex w-full max-w-md items-center justify-between gap-3 sm:w-auto">
        <Link
          href={prev ?? "#"}
          rel={prev ? "prev" : undefined}
          aria-disabled={!prev}
          tabIndex={prev ? undefined : -1}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 flex-1 px-4 sm:flex-none", !prev && disabled)}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </Link>

        <span className="shrink-0 text-sm text-muted-foreground tabular-nums sm:hidden" aria-live="polite">
          Page {currentPage} of {totalPages}
        </span>

        <ol className="hidden items-center gap-1 sm:flex">
          {pageWindow(currentPage, totalPages).map((p, i) =>
            p === null ? (
              <li key={`gap-${i}`} className="flex h-10 w-8 items-center justify-center text-muted-foreground" aria-hidden="true">
                <MoreHorizontal className="h-4 w-4" />
              </li>
            ) : (
              <li key={p}>
                <Link
                  href={pageHref(basePath, p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  aria-label={`Page ${p}`}
                  className={cn(
                    buttonVariants({ variant: p === currentPage ? "default" : "ghost", size: "icon" }),
                    "tabular-nums"
                  )}
                >
                  {p}
                </Link>
              </li>
            )
          )}
        </ol>

        <Link
          href={next ?? "#"}
          rel={next ? "next" : undefined}
          aria-disabled={!next}
          tabIndex={next ? undefined : -1}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 flex-1 px-4 sm:flex-none", !next && disabled)}
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <p className="hidden text-sm text-muted-foreground tabular-nums sm:block">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  )
}
