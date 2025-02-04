"use client"

import { useState } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import CategoryFilter from "@/components/CategoryFilter"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"

// Updated mock data with ImageKit URLs
const mockWallpapers = [
  {
    id: "1",
    title: "First-Image",
    imageUrl: "https://ik.imagekit.io/starknight/default-image.jpg", 
    category: "Potrait",
  },
  {
    id: "2",
    title: "First-Image",
    imageUrl: "https://ik.imagekit.io/starknight/Girl-thinking.jpg", 
    category: "Girl",
  },
]

const categories = ["Photography", "Nature", "Urban", "Abstract", "Minimalist", "Colorful"]

interface Wallpaper {
  id: string
  title: string
  imageUrl: string
  category: string
}

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
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Wallpapers</h1>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <WallpaperGrid 
        wallpapers={filteredWallpapers} 
        onPreview={handlePreview}
      />
      <WallpaperPreviewModal
        wallpaper={selectedWallpaper}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </main>
  )
}

