"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import WallpaperGrid from "@/components/WallpaperGrid"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import { Wallpaper } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll"

const ITEMS_PER_PAGE = 12

export default function CategoryPage() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const category = slug.charAt(0).toUpperCase() + slug.slice(1)

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [displayedWallpapers, setDisplayedWallpapers] = useState<Wallpaper[]>([])
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(true)

  const fetchWallpapers = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = await fetch('/api/wallpapers/sync')
      const data = await response.json()
      
      if (data.success && data.wallpapers) {
        const filtered = data.wallpapers.filter(
          (w: Wallpaper) => w.category.toLowerCase() === slug.toLowerCase()
        )
        setWallpapers(filtered)
        setDisplayedWallpapers(filtered.slice(0, ITEMS_PER_PAGE))
        setHasMore(filtered.length > ITEMS_PER_PAGE)
      }
    } catch (error) {
      console.error('Failed to fetch wallpapers:', error)
      toast.error('Failed to load wallpapers')
    } finally {
      setIsFetching(false)
    }
  }, [slug])

  useEffect(() => {
    fetchWallpapers()
  }, [fetchWallpapers])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const nextPage = page + 1
    const startIndex = page * ITEMS_PER_PAGE
    const endIndex = nextPage * ITEMS_PER_PAGE
    const newItems = wallpapers.slice(startIndex, endIndex)
    
    setDisplayedWallpapers(prev => [...prev, ...newItems])
    setPage(nextPage)
    setLoading(false)
    
    if (endIndex >= wallpapers.length) {
      setHasMore(false)
    }
  }, [loading, hasMore, page, wallpapers])

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading,
    threshold: 0.5
  })

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedWallpaper) return
    
    const currentIndex = displayedWallpapers.findIndex(w => w.id === selectedWallpaper.id)
    if (currentIndex === -1) return
    
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedWallpaper(displayedWallpapers[currentIndex - 1])
    } else if (direction === 'next' && currentIndex < displayedWallpapers.length - 1) {
      setSelectedWallpaper(displayedWallpapers[currentIndex + 1])
    }
  }

  const canNavigatePrev = selectedWallpaper 
    ? displayedWallpapers.findIndex(w => w.id === selectedWallpaper.id) > 0
    : false
  
  const canNavigateNext = selectedWallpaper
    ? displayedWallpapers.findIndex(w => w.id === selectedWallpaper.id) < displayedWallpapers.length - 1
    : false

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{category} Wallpapers</h1>
        <p className="text-muted-foreground">
          Explore our collection of high-quality {category.toLowerCase()} wallpapers ({wallpapers.length} wallpapers)
        </p>
      </div>

      {isFetching && displayedWallpapers.length === 0 ? (
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading {category.toLowerCase()} wallpapers...</p>
        </div>
      ) : displayedWallpapers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">
            No wallpapers found in this category yet.
          </p>
          <Link href="/">
            <Button>Browse All Wallpapers</Button>
          </Link>
        </div>
      ) : (
        <>
          <WallpaperGrid 
            wallpapers={displayedWallpapers} 
            onPreview={handlePreview}
            isLoading={loading}
          />

          <div ref={sentinelRef} className="h-10 flex justify-center items-center mt-8">
            {loading && hasMore && (
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
        canNavigatePrev={canNavigatePrev}
        canNavigateNext={canNavigateNext}
      />
    </div>
  )
}

