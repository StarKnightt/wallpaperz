"use client"

import { useState } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import CategoryFilter from "@/components/CategoryFilter"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import { Wallpaper, WallpaperCategory } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"
import Hero from "@/components/Hero"

// Updated mock data with ImageKit URLs
const mockWallpapers = [
  {
    id: "1",
    title: "First-Image",
    imageUrl: "https://ik.imagekit.io/starknight/default-image.jpg",
    category: "Potrait",
    description: "A beautiful portrait showcasing natural light and composition",
  },
  {
    id: "2",
    title: "First-Image",
    imageUrl: "https://ik.imagekit.io/starknight/Girl-thinking.jpg",
    category: "Girl",
    description: "Capturing a moment of deep contemplation and emotion",
  },
]

const categories: WallpaperCategory[] = ["Photography", "Nature", "Urban", "Abstract", "Minimalist", "Colorful"]

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredWallpapers = mockWallpapers
    .filter(w => {
      const matchesCategory = !selectedCategory || w.category === selectedCategory
      const matchesSearch = !searchQuery || 
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-12">
      <Hero />
      
      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Featured Wallpapers */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Wallpapers</h2>
          <Button variant="link">View All</Button>
        </div>
        <WallpaperGrid 
          wallpapers={filteredWallpapers} 
          onPreview={handlePreview}
        />
      </section>

      <WallpaperPreviewModal
        wallpaper={selectedWallpaper}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}

