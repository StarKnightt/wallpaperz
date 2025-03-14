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

const ITEMS_PER_PAGE = 8

// Get unique categories from allWallpapers
const categories = Array.from(new Set(allWallpapers.map(w => w.category)))

export default function Page() {
  const { isSignedIn } = useAuth()
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearch()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filteredWallpapers, setFilteredWallpapers] = useState<Wallpaper[]>([])

  // Filter wallpapers based on search query or category
  useEffect(() => {
    let filtered = allWallpapers
    
    if (searchQuery) {
      filtered = allWallpapers.filter(w => {
        const searchableText = [
          w.title,
          w.category,
          w.description
        ].join(' ').toLowerCase()
        return searchableText.includes(searchQuery.toLowerCase())
      })
    } else if (activeCategory !== DEFAULT_CATEGORY) {
      filtered = allWallpapers.filter(w => w.category === activeCategory)
    }
    
    setFilteredWallpapers(filtered)
    setPage(1)
    setHasMore(filtered.length > ITEMS_PER_PAGE)
  }, [searchQuery, activeCategory])

  // Update URL params effect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchParam = params.get('search')
    const categoryParam = params.get('category')
    
    if (searchParam) {
      setSearchQuery(searchParam)
    } else if (categoryParam) {
      setActiveCategory(categoryParam)
    }
  }, [setSearchQuery, setActiveCategory])

  const paginatedWallpapers = filteredWallpapers.slice(0, page * ITEMS_PER_PAGE)

  const loadMore = async () => {
    setLoading(true)
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    setPage(prev => prev + 1)
    setLoading(false)
    
    // Only hide button if we've loaded all wallpapers
    if ((page + 1) * ITEMS_PER_PAGE >= filteredWallpapers.length) {
      setHasMore(false)
    }
  }

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-8 pb-16">
      <Hero />
      
      {/* Category Filter */}
      <section className="container mx-auto px-4 -mt-4">
        <CategoryFilter categories={categories} selectedCategory={null} onSelectCategory={() => {}} />
      </section>
      
      {/* Search Results Section */}
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
            wallpapers={paginatedWallpapers} 
            onPreview={handlePreview}
            isLoading={loading}
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

      {/* Show regular content only when not searching */}
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
            wallpapers={paginatedWallpapers} 
            onPreview={handlePreview}
            isLoading={loading}
          />

          {/* Load More Button */}
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

      {/* No results message */}
      {filteredWallpapers.length === 0 && !searchQuery && (
        <div className="text-center py-16 container mx-auto px-4">
          <p className="text-lg text-muted-foreground">
            No wallpapers found in this category. Try a different category.
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
