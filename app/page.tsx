"use client"

import { useState, useEffect, useCallback } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import CategoryFilter from "@/components/CategoryFilter"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import { Wallpaper } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"
import Hero from "@/components/Hero"
import { useSearch, DEFAULT_CATEGORY } from "@/context/SearchContext"
import { Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import StructuredData from "@/components/StructuredData"
import Image from 'next/image'
import { toast } from "sonner"
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh"
import PullToRefresh from "@/components/PullToRefresh"

const ITEMS_PER_PAGE = 12

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Page() {
  const { isSignedIn } = useAuth()
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearch()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filteredWallpapers, setFilteredWallpapers] = useState<Wallpaper[]>([])
  const [displayedWallpapers, setDisplayedWallpapers] = useState<Wallpaper[]>([])
  const [allWallpapersData, setAllWallpapersData] = useState<Wallpaper[]>([])
  const [isFetchingWallpapers, setIsFetchingWallpapers] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [fetchError, setFetchError] = useState(false)

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wallpaperz',
    url: 'https://wallpaperz.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://wallpaperz.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const fetchWallpapers = useCallback(async () => {
    setIsFetchingWallpapers(true)
    setFetchError(false)
    try {
      const response = await fetch('/api/wallpapers/sync')
      const data = await response.json()
      
      if (data.success && data.wallpapers && data.wallpapers.length > 0) {
        const shuffledWallpapers = shuffleArray(data.wallpapers as Wallpaper[])
        setAllWallpapersData(shuffledWallpapers)
        
        const uniqueCategories = Array.from(new Set(shuffledWallpapers.map((w) => w.category))) as string[]
        setCategories(uniqueCategories)
        
        if (!data.cached) {
          console.log(`✅ Loaded ${data.wallpapers.length} wallpapers from ImageKit`)
        } else {
          console.log(`✅ Loaded ${data.wallpapers.length} wallpapers from cache`)
        }
      } else {
        console.error('No wallpapers found in ImageKit')
        setFetchError(true)
        toast.error('No wallpapers found. Please upload images to ImageKit.')
      }
    } catch (error) {
      console.error('Failed to fetch wallpapers from ImageKit:', error)
      setFetchError(true)
      toast.error('Failed to load wallpapers. Please check your connection.')
    } finally {
      setIsFetchingWallpapers(false)
    }
  }, [])

  useEffect(() => {
    fetchWallpapers()
  }, [fetchWallpapers])

  useEffect(() => {
    let filtered = allWallpapersData
    
    if (searchQuery) {
      filtered = allWallpapersData.filter(w => {
        const searchableText = [
          w.title,
          w.category,
          w.description
        ].join(' ').toLowerCase()
        return searchableText.includes(searchQuery.toLowerCase())
      })
    } else if (activeCategory !== DEFAULT_CATEGORY) {
      filtered = allWallpapersData.filter(w => w.category === activeCategory)
    }
    
    setFilteredWallpapers(filtered)
    setPage(1)
    setHasMore(filtered.length > ITEMS_PER_PAGE)
    setDisplayedWallpapers(filtered.slice(0, ITEMS_PER_PAGE))
  }, [searchQuery, activeCategory, allWallpapersData])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchParam = params.get('search')
    const categoryParam = params.get('category')
    const wallpaperParam = params.get('wallpaper')
    
    if (searchParam) {
      setSearchQuery(searchParam)
    } else if (categoryParam) {
      setActiveCategory(categoryParam)
    }
    
    if (wallpaperParam && allWallpapersData.length > 0) {
      const wallpaper = allWallpapersData.find(w => w.id === wallpaperParam)
      if (wallpaper) {
        setSelectedWallpaper(wallpaper)
        setIsPreviewOpen(true)
        
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [setSearchQuery, setActiveCategory, allWallpapersData])

  const loadMore = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const nextPage = page + 1
    const startIndex = page * ITEMS_PER_PAGE
    const endIndex = nextPage * ITEMS_PER_PAGE
    const newItems = filteredWallpapers.slice(startIndex, endIndex)
    
    setDisplayedWallpapers(prev => [...prev, ...newItems])
    setPage(nextPage)
    setLoading(false)
    
    if (endIndex >= filteredWallpapers.length) {
      setHasMore(false)
    }
  }

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

  const handleRefresh = useCallback(async () => {
    toast.info('Refreshing wallpapers...')
    await fetch('/api/wallpapers/sync', { method: 'POST' })
    await fetchWallpapers()
    toast.success('Wallpapers refreshed!')
  }, [fetchWallpapers])

  const pullToRefresh = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    enabled: true
  })

  return (
    <>
      <StructuredData data={websiteSchema} />
      <PullToRefresh
        isRefreshing={pullToRefresh.isRefreshing}
        pullDistance={pullToRefresh.pullDistance}
        pullProgress={pullToRefresh.pullProgress}
        showIndicator={pullToRefresh.showIndicator}
      />
      <div className="space-y-8 pb-16">
        <Hero />
        
       
        <section className="container mx-auto px-4 -mt-4">
          <CategoryFilter categories={categories} />
        </section>
       
        {searchQuery && (
          <section id="search-results" className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  Search Results for &quot;{searchQuery}&quot;
                </h2>
                <p className="text-sm text-muted-foreground">
                  Found {filteredWallpapers.length} wallpapers
                </p>
              </div>
            </div>

            <WallpaperGrid 
              wallpapers={displayedWallpapers} 
              onPreview={handlePreview}
              isLoading={loading && displayedWallpapers.length === 0}
            />

            {filteredWallpapers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No wallpapers found for &quot;{searchQuery}&quot;. Try different keywords.
                </p>
              </div>
            )}
          </section>
        )}

        {!searchQuery && (
          <section id="wallpapers-section" className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {activeCategory === DEFAULT_CATEGORY ? "All Wallpapers" : activeCategory}
                </h2>
                {activeCategory === DEFAULT_CATEGORY && (
                  <p className="text-sm text-muted-foreground">
                    Browse through our collection of high-quality wallpapers
                  </p>
                )}
              </div>
            </div>

            <WallpaperGrid 
              wallpapers={displayedWallpapers} 
              onPreview={handlePreview}
              isLoading={loading && displayedWallpapers.length === 0}
            />

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button 
                  onClick={loadMore} 
                  disabled={loading}
                  size="lg"
                  className="min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </section>
        )}

        {filteredWallpapers.length === 0 && !searchQuery && !isFetchingWallpapers && (
          <div className="text-center py-16 container mx-auto px-4">
            <p className="text-lg text-muted-foreground">
              {fetchError 
                ? 'Failed to load wallpapers. Please refresh the page.' 
                : 'No wallpapers found in this category. Try a different category.'}
            </p>
            {fetchError && (
              <Button 
                onClick={handleRefresh} 
                className="mt-4"
                variant="outline"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        )}

        {isFetchingWallpapers && displayedWallpapers.length === 0 && (
          <div className="text-center py-16 container mx-auto px-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Loading wallpapers from ImageKit...
            </p>
          </div>
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
    </>
  )
}
