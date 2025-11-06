import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
  threshold?: number
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  threshold = 0.8
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore()
      }
    },
    [hasMore, loading, onLoadMore]
  )

  useEffect(() => {
    if (!sentinelRef.current) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '200px',
      threshold
    })

    observerRef.current.observe(sentinelRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, threshold])

  return sentinelRef
}

