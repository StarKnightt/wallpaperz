"use client"

import { useState, useEffect } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import CategoryFilter from "@/components/CategoryFilter"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import { Wallpaper, WallpaperCategory } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"
import Hero from "@/components/Hero"
import { useSearch } from "@/context/SearchContext"
import { Loader2 } from "lucide-react"
import { allWallpapers } from "@/data/wallpapers"

const ITEMS_PER_PAGE = 8

// Get unique categories from allWallpapers
const categories = Array.from(new Set(allWallpapers.map(w => w.category)))

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { searchQuery } = useSearch()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Separate search results from regular wallpapers
  const searchResults = searchQuery ? allWallpapers
    .filter(w => {
      const searchableText = [
        w.title,
        w.category,
        w.description
      ].join(' ').toLowerCase()
      return searchableText.includes(searchQuery.toLowerCase())
    }) : []

  // Regular filtered wallpapers (excluding search)
  const filteredWallpapers = searchQuery ? [] : allWallpapers
    .filter(w => !selectedCategory || w.category === selectedCategory)

  const paginatedWallpapers = filteredWallpapers.slice(0, page * ITEMS_PER_PAGE)

  // Scroll to search results when query changes
  useEffect(() => {
    if (searchQuery) {
      const searchSection = document.getElementById('search-results')
      searchSection?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [searchQuery])

  const loadMore = async () => {
    setLoading(true)
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
    <div className="space-y-16 pb-24"> {/* Increased spacing between sections and bottom padding */}
      <Hero />
      
      {/* Search Results Section */}
      {searchQuery && (
        <section id="search-results" className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              <p className="text-muted-foreground">
                Found {searchResults.length} wallpapers
              </p>
            </div>
          </div>

          <WallpaperGrid 
            wallpapers={searchResults} 
            onPreview={handlePreview}
            isLoading={loading}
          />

          {searchResults.length === 0 && (
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
        <>
          {/* Categories Section */}
          <section className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"> {/* Increased gaps */}
              <div>
                <h2 className="text-2xl font-bold">Browse Categories</h2>
                <p className="text-muted-foreground">Filter wallpapers by category</p>
              </div>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </section>

          {/* Wallpapers Grid */}
          <section id="wallpapers-section" className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10"> {/* Increased margin */}
              <div>
                <h2 className="text-2xl font-bold mb-2"> {/* Added margin to subtitle */}
                  {selectedCategory || "All Wallpapers"}
                </h2>
                <p className="text-muted-foreground">
                  {filteredWallpapers.length} wallpapers total • Showing {paginatedWallpapers.length} {/* Improved count display */}
                </p>
              </div>
            </div>

            <WallpaperGrid 
              wallpapers={paginatedWallpapers} 
              onPreview={handlePreview}
              isLoading={loading}
            />

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
        </>
      )}

      {/* No results message */}
      {filteredWallpapers.length === 0 && (
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

