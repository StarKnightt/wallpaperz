import { pageHref } from "@/lib/pagination"

const BASE_URL = "https://wallpaperz.in"

// Next's Metadata API has no rel=prev/next slot; React 19 hoists <link>
// elements rendered anywhere in the tree into <head>, so this works from a
// server component with zero client JS.
export default function PaginationHead({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number
  totalPages: number
  basePath: string
}) {
  return (
    <>
      {currentPage > 1 && <link rel="prev" href={`${BASE_URL}${pageHref(basePath, currentPage - 1)}`} />}
      {currentPage < totalPages && <link rel="next" href={`${BASE_URL}${pageHref(basePath, currentPage + 1)}`} />}
    </>
  )
}
