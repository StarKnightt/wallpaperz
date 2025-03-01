"use client"

import { useState, useEffect } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import CategoryFilter from "@/components/CategoryFilter"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import { Wallpaper } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"
import Hero from "@/components/Hero"
import { useSearch, DEFAULT_CATEGORY } from "@/context/SearchContext"
import { Loader2 } from "lucide-react"
import { allWallpapers } from "@/data/wallpapers"
import { useAuth } from "@clerk/nextjs"
import Advertisement from '@/components/Advertisement'

const ITEMS_PER_PAGE = 8

// Get unique categories from allWallpapers
const categories = Array.from(new Set(allWallpapers.map(w => w.category)))

// Get random wallpapers from filtered list
const randomizeWallpapers = (wallpapers: Wallpaper[]) => {
  return [...wallpapers].sort(() => Math.random() - 0.5)
}

export default function Page() {
  const { isSignedIn } = useAuth()
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearch()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [randomizedWallpapers, setRandomizedWallpapers] = useState(allWallpapers)

  // Move randomization to useEffect to avoid hydration mismatch
  useEffect(() => {
    const randomized = searchQuery ? allWallpapers
      .filter(w => {
        const searchableText = [
          w.title,
          w.category,
          w.description
        ].join(' ').toLowerCase()
        return searchableText.includes(searchQuery.toLowerCase())
      }) : allWallpapers.filter(w => 
        activeCategory === DEFAULT_CATEGORY || w.category === activeCategory
      )
    
    setRandomizedWallpapers([...randomized].sort(() => Math.random() - 0.5))
  }, [searchQuery, activeCategory])

  const paginatedWallpapers = randomizedWallpapers.slice(0, page * ITEMS_PER_PAGE)

  // Update URL params effect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchParam = params.get('search')
    const categoryParam = params.get('category')
    
    if (searchParam) {
      setSearchQuery(searchParam)
    } else if (categoryParam) {
      setActiveCategory(categoryParam)
      setSearchQuery(categoryParam)
    } else {
      // Set default category if no params are present
      setActiveCategory(DEFAULT_CATEGORY)
    }
  }, [setSearchQuery, setActiveCategory])

  const loadMore = async () => {
    setLoading(true)
    setPage(prev => prev + 1)
    setLoading(false)
    
    // Only hide button if we've loaded all wallpapers
    if ((page + 1) * ITEMS_PER_PAGE >= randomizedWallpapers.length) {
      setHasMore(false)
    }
  }

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-8 pb-16"> {/* Reduced spacing */}
      <Hero />
      <Advertisement 
        slot="YOUR_AD_SLOT_ID"
        format="rectangle"
        className="my-8"
      />
      
      {/* Search Results Section */}
      {searchQuery && (
        <section id="search-results" className="container mx-auto px-4 -mt-4"> {/* Negative margin to pull content up */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              <p className="text-muted-foreground">
                Found {randomizedWallpapers.length} wallpapers
              </p>
            </div>
          </div>

          <WallpaperGrid 
            wallpapers={randomizedWallpapers} 
            onPreview={handlePreview}
            isLoading={loading}
          />

          {randomizedWallpapers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No wallpapers found for &quot;{searchQuery}&quot;. Try different keywords.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Show regular content only when not searching */}
      {!searchQuery && (
        <section id="wallpapers-section" className="container mx-auto px-4 -mt-4"> {/* Negative margin to pull content up */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {activeCategory === DEFAULT_CATEGORY ? "All Wallpapers" : activeCategory}
              </h2>
              {activeCategory === DEFAULT_CATEGORY && (
                <p className="text-muted-foreground">
                  Browse through our complete collection of high-quality wallpapers
                </p>
              )}
            </div>
          </div>

          <WallpaperGrid 
            wallpapers={paginatedWallpapers.slice(0, 4)} 
            onPreview={handlePreview}
            isLoading={loading}
          />
          <Advertisement 
            slot="YOUR_AD_SLOT_ID"
            format="auto"
            layout="in-article"
            className="my-8"
          />
          <WallpaperGrid 
            wallpapers={paginatedWallpapers.slice(4)} 
            onPreview={handlePreview}
            isLoading={loading}
          />

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12 mb-2"> {/* Increased margins */}
              <Button 
                onClick={(e) => {
                  e.preventDefault() // Prevent default button behavior
                  loadMore()
                }} 
                disabled={loading}
                size="lg"
                className="min-w-[160px]" // Reduced button width
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

      {/* No results message */}
      {randomizedWallpapers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No wallpapers found for your search. Try different keywords or categories.
          </p>
        </div>
      )}

      <WallpaperPreviewModal
        wallpaper={selectedWallpaper}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}
