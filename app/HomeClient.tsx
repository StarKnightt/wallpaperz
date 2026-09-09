"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import WallpaperGrid from "@/components/WallpaperGrid"
import DeviceFilter, { DeviceFilterValue, isPortraitWallpaper, matchesDeviceFilter } from "@/components/DeviceFilter"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import WallpaperListingClient from "@/components/WallpaperListingClient"
import Pagination from "@/components/Pagination"
import CategoryChips from "@/components/CategoryChips"
import { Wallpaper } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"
import Hero from "@/components/Hero"
import { useSearch, DEFAULT_CATEGORY } from "@/context/SearchContext"
import { Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh"
import PullToRefresh from "@/components/PullToRefresh"
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll"
import { PAGE_SIZE } from "@/lib/pagination"

interface HomeClientProps {
  /** Server-rendered slice for this list page (24 wallpapers) */
  wallpapers: Wallpaper[]
  page: number
  totalPages: number
  total: number
  /** Distinct category names for the chip row */
  categories: string[]
  /** Full hero on page 1 only; /page/n gets a compact header */
  showHero: boolean
}

// Data flow: the paginated grid is server-rendered from props (crawlable,
// prerendered per /page/N). Search and the hero category chips still filter
// the whole library client-side - the full list is fetched lazily from
// /api/wallpapers only once a search/category filter is active.
export default function HomeClient({ wallpapers, page, totalPages, total, categories, showHero }: HomeClientProps) {
  const router = useRouter()
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearch()
  const filterMode = !!searchQuery || activeCategory !== DEFAULT_CATEGORY

  const [library, setLibrary] = useState<Wallpaper[] | null>(null)
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [libraryError, setLibraryError] = useState(false)
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilterValue>("all")
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchLibrary = useCallback(async () => {
    setLibraryLoading(true)
    setLibraryError(false)
    try {
      const response = await fetch('/api/wallpapers')
      const data = await response.json()
      if (data.success && Array.isArray(data.wallpapers) && data.wallpapers.length > 0) {
        setLibrary(data.wallpapers as Wallpaper[])
      } else {
        setLibraryError(true)
        toast.error('No wallpapers found. Please try again later.')
      }
    } catch (error) {
      console.error('Failed to fetch wallpapers:', error)
      setLibraryError(true)
      toast.error('Failed to load wallpapers. Please check your connection.')
    } finally {
      setLibraryLoading(false)
    }
  }, [])

  // Only pay for the full-library fetch once the user actually filters
  useEffect(() => {
    if (filterMode && !library && !libraryLoading && !libraryError) fetchLibrary()
  }, [filterMode, library, libraryLoading, libraryError, fetchLibrary])

  // Search/category filtering across the whole library (filter mode only)
  const searchResults = useMemo(() => {
    if (!library) return []
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return library.filter((w) => [w.title, w.category, w.description].join(' ').toLowerCase().includes(q))
    }
    if (activeCategory !== DEFAULT_CATEGORY) {
      return library.filter((w) => w.category === activeCategory)
    }
    return library
  }, [library, searchQuery, activeCategory])

  const deviceFilteredResults = useMemo(
    () => searchResults.filter((w) => matchesDeviceFilter(w, deviceFilter)),
    [searchResults, deviceFilter]
  )

  const deviceCounts = useMemo(() => ({
    all: searchResults.length,
    mobile: searchResults.filter(isPortraitWallpaper).length,
    desktop: searchResults.filter((w) => !isPortraitWallpaper(w)).length,
  }), [searchResults])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchQuery, activeCategory, deviceFilter])

  const displayedResults = deviceFilteredResults.slice(0, visibleCount)
  const hasMore = visibleCount < deviceFilteredResults.length

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setVisibleCount((c) => c + PAGE_SIZE)
    setLoadingMore(false)
  }, [loadingMore, hasMore])

  const sentinelRef = useInfiniteScroll({ onLoadMore: loadMore, hasMore, loading: loadingMore, threshold: 0.5 })

  const handleDeviceFilterChange = useCallback((value: DeviceFilterValue) => {
    setDeviceFilter(value)
    // Keep the ?device= param in sync so filtered views are shareable
    const params = new URLSearchParams(window.location.search)
    if (value === "all") params.delete("device")
    else params.set("device", value)
    const query = params.toString()
    window.history.replaceState({}, "", query ? `${window.location.pathname}?${query}` : window.location.pathname)
  }, [])

  // Client-only URL params (the route itself is prerendered without them)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchParam = params.get('search')
    const categoryParam = params.get('category')
    const wallpaperParam = params.get('wallpaper')
    const deviceParam = params.get('device')

    if (deviceParam === 'mobile' || deviceParam === 'desktop') setDeviceFilter(deviceParam)

    if (searchParam) {
      setSearchQuery(searchParam)
    } else if (categoryParam) {
      setActiveCategory(categoryParam)
    }

    if (wallpaperParam) {
      const wallpaper = wallpapers.find((w) => w.id === wallpaperParam)
      if (wallpaper) {
        setSelectedWallpaper(wallpaper)
        setIsPreviewOpen(true)
        window.history.replaceState({}, '', window.location.pathname)
      } else {
        // Legacy share links: the wallpaper isn't on this page, send to its own page
        router.replace(`/wallpaper/${wallpaperParam}`)
      }
    }
  }, [setSearchQuery, setActiveCategory, wallpapers, router])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setActiveCategory(DEFAULT_CATEGORY)
    window.history.replaceState({}, '', window.location.pathname)
  }, [setSearchQuery, setActiveCategory])

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  const currentIndex = selectedWallpaper ? displayedResults.findIndex((w) => w.id === selectedWallpaper.id) : -1

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return
    if (direction === 'prev' && currentIndex > 0) setSelectedWallpaper(displayedResults[currentIndex - 1])
    else if (direction === 'next' && currentIndex < displayedResults.length - 1) setSelectedWallpaper(displayedResults[currentIndex + 1])
  }

  const handleRefresh = useCallback(async () => {
    toast.info('Refreshing wallpapers...')
    try {
      await fetch('/api/wallpapers/sync', { method: 'POST' })
    } catch {
      // best effort - the refresh below still re-renders from the server cache
    }
    setLibrary(null)
    router.refresh()
    toast.success('Wallpapers refreshed!')
  }, [router])

  const pullToRefresh = usePullToRefresh({ onRefresh: handleRefresh, threshold: 80, enabled: true })

  const filterTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : activeCategory

  return (
    <>
      <PullToRefresh
        isRefreshing={pullToRefresh.isRefreshing}
        pullDistance={pullToRefresh.pullDistance}
        pullProgress={pullToRefresh.pullProgress}
        showIndicator={pullToRefresh.showIndicator}
      />
      <div className="space-y-8 pb-16">
        {showHero ? (
          <Hero />
        ) : (
          <section className="container mx-auto px-4 pt-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              All Wallpapers <span className="text-muted-foreground font-normal">&mdash; Page {page}</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Free HD &amp; 4K wallpapers for desktop and phone. Page {page} of {totalPages}, {total} wallpapers in total.
            </p>
          </section>
        )}

        <section className={showHero ? "container mx-auto px-4 -mt-4" : "container mx-auto px-4"}>
          <CategoryChips categories={categories} />
        </section>

        {filterMode ? (
          <section id="search-results" className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">{filterTitle}</h2>
                <p className="text-sm text-muted-foreground">
                  {libraryLoading ? 'Searching...' : `Found ${deviceFilteredResults.length} wallpapers`}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="ml-3 inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <X className="h-3.5 w-3.5" /> Clear
                  </button>
                </p>
              </div>
              <DeviceFilter value={deviceFilter} onChange={handleDeviceFilterChange} counts={deviceCounts} />
            </div>

            {libraryLoading && !library ? (
              <div className="text-center py-16">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Loading wallpapers...</p>
              </div>
            ) : libraryError ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Failed to load wallpapers. Please try again.</p>
                <Button onClick={fetchLibrary} className="mt-4" variant="outline">
                  <Loader2 className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : deviceFilteredResults.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  {searchQuery
                    ? `No wallpapers found for "${searchQuery}". Try different keywords.`
                    : 'No wallpapers found in this category. Try a different category.'}
                </p>
              </div>
            ) : (
              <>
                <WallpaperGrid wallpapers={displayedResults} onPreview={handlePreview} />
                <div ref={sentinelRef} className="h-10 flex justify-center items-center">
                  {loadingMore && hasMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading more wallpapers...</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <WallpaperPreviewModal
              wallpaper={selectedWallpaper}
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              onNavigate={handleNavigate}
              canNavigatePrev={currentIndex > 0}
              canNavigateNext={currentIndex >= 0 && currentIndex < displayedResults.length - 1}
            />
          </section>
        ) : (
          <section id="wallpapers-section" className="container mx-auto px-4">
            <WallpaperListingClient
              wallpapers={wallpapers}
              device={deviceFilter}
              onDeviceChange={handleDeviceFilterChange}
              heading={
                <>
                  <h2 className="text-xl md:text-2xl font-bold mb-2">
                    {showHero ? 'All Wallpapers' : `Wallpapers ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, total)}`}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {showHero
                      ? `Browse through our collection of ${total} high-quality wallpapers`
                      : `Newest first. ${total} wallpapers across ${totalPages} pages.`}
                  </p>
                </>
              }
            />
            <Pagination currentPage={page} totalPages={totalPages} basePath="/" className="mt-10" />
          </section>
        )}
      </div>
    </>
  )
}
