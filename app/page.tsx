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

const mockWallpapers: Wallpaper[] = [
  {
    id: "1",
    title: "First Image",
    imageUrl: "https://ik.imagekit.io/starknight/default-image.jpg",
    category: "Photography",
    description: "A beautiful portrait showcasing natural light and composition"
  },
  {
    id: "2",
    title: "Girl Sitting",
    imageUrl: "https://ik.imagekit.io/starknight/Girl-thinking.jpg",
    category: "Photography",
    description: "Capturing a moment of deep contemplation and emotion"
  },
  {
    id: "3",
    title: "Stay Balanced",
    imageUrl: "https://ik.imagekit.io/starknight/Motivation/stay-balanced.png",
    category: "Minimalist",
    description: "A motivational wallpaper to keep you going"
  },
  {
    id: "4",
    title: "Discipline",
    imageUrl: "https://ik.imagekit.io/starknight/Motivation/motivation.png",
    category: "Minimalist",
    description: "Discipline is the bridge between goals and accomplishment"
  }
]

const categories: WallpaperCategory[] = ["Photography", "Nature", "Urban", "Abstract", "Minimalist", "Colorful"]

const ITEMS_PER_PAGE = 8

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { searchQuery } = useSearch()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const filteredWallpapers = mockWallpapers
    .filter(w => {
      const matchesCategory = !selectedCategory || w.category === selectedCategory
      const matchesSearch = !searchQuery || 
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })

  const paginatedWallpapers = filteredWallpapers.slice(0, page * ITEMS_PER_PAGE)
  
  const loadMore = async () => {
    setLoading(true)
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPage(prev => prev + 1)
    setLoading(false)
    
    // Check if we've reached the end
    if (paginatedWallpapers.length >= filteredWallpapers.length) {
      setHasMore(false)
    }
  }

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-12">
      <Hero />
      
      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {selectedCategory || "All Wallpapers"}
            </h2>
            <p className="text-muted-foreground">
              {paginatedWallpapers.length} wallpapers found
            </p>
          </div>
        </div>

        <WallpaperGrid 
          wallpapers={paginatedWallpapers} 
          onPreview={handlePreview}
        />

        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button 
              onClick={loadMore} 
              disabled={loading}
              size="lg"
              className="min-w-[200px]"
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

      <WallpaperPreviewModal
        wallpaper={selectedWallpaper}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}

