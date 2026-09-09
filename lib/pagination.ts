// Path-segment pagination shared by /, /category/[slug] and /color/[slug].
// Query-string pagination can't be prerendered (Workers free plan needs every
// route static), so page N lives at `${basePath}/page/${N}` and page 1 is the
// bare list URL.
export const PAGE_SIZE = 24

export interface PageSlice<T> {
  items: T[]
  page: number
  totalPages: number
  total: number
}

export function totalPagesFor(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE))
}

/** Returns null when `page` is out of range (caller decides notFound/redirect). */
export function paginate<T>(items: T[], page: number): PageSlice<T> | null {
  const totalPages = totalPagesFor(items.length)
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null
  const start = (page - 1) * PAGE_SIZE
  return { items: items.slice(start, start + PAGE_SIZE), page, totalPages, total: items.length }
}

/** Strictly-numeric route param -> page number, or NaN for junk like "2abc". */
export function parsePageParam(raw: string): number {
  return /^\d+$/.test(raw) ? Number(raw) : NaN
}

/** `/` -> `/page/2`, `/category/anime` -> `/category/anime/page/2`; page 1 is the bare path. */
export function pageHref(basePath: string, page: number): string {
  const base = basePath === '/' ? '' : basePath.replace(/\/$/, '')
  return page <= 1 ? base || '/' : `${base}/page/${page}`
}

/** Params for generateStaticParams: pages 2..N (page 1 is the parent route). */
export function extraPageParams(total: number): { n: string }[] {
  const pages = totalPagesFor(total)
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ n: String(i + 2) }))
}
