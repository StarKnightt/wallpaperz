"use client"

import { useState } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import CategoryFilter from "@/components/CategoryFilter"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"

// Updated mock data with ImageKit URLs
const mockWallpapers = [
  {
    id: "1",
    title: "Portrait Photography",
    imageUrl: "https://ik.imagekit.io/starknight/default-image.jpg",
    category: "Photography",
  },
  // {
  //   id: "2",
  //   title: "Mountain Landscape",
  //   imageUrl: "https://ik.imagekit.io/starknight/mountain.jpg",
  //   category: "Nature",
  // },
  // {
  //   id: "3",
  //   title: "City Skyline",
  //   imageUrl: "https://ik.imagekit.io/starknight/city.jpg",
  //   category: "Urban",
  // },
  // {
  //   id: "4",
  //   title: "Abstract Art",
  //   imageUrl: "https://ik.imagekit.io/starknight/abstract.jpg",
  //   category: "Abstract",
  // },
]

const categories = ["Photography", "Nature", "Urban", "Abstract", "Minimalist", "Colorful"]

interface Wallpaper {
  id: string
  title: string
  imageUrl: string
  category: string
}

export default function Page() {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)

  return (
    <main className="container mx-auto py-6">
      <WallpaperGrid 
        wallpapers={mockWallpapers} 
        onPreview={setSelectedWallpaper} 
      />
    </main>
  )
}

