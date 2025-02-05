"use client"

import { useState } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import CategoryFilter from "@/components/CategoryFilter"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import { Wallpaper, WallpaperCategory } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"

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

  const filteredWallpapers = selectedCategory
    ? mockWallpapers.filter(w => w.category === selectedCategory)
    : mockWallpapers

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Wallpaperz</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Discover and download beautiful high-quality wallpapers for your desktop and mobile devices.
          Browse through our carefully curated collection across various categories.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary">Browse Categories</Button>
          <Button variant="outline" className="bg-white hover:bg-gray-100">
            Latest Wallpapers
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Featured Wallpapers */}
      <section>
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

