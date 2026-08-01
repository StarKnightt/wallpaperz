"use client"

import { useState } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import { Wallpaper } from "@/types/wallpaper"

// Client shell around the grid: the wallpaper list itself is passed down from
// the server component so every card is present in the SSR HTML for crawlers.
export default function ColorPageClient({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedWallpaper) return
    const currentIndex = wallpapers.findIndex(w => w.id === selectedWallpaper.id)
    if (currentIndex === -1) return
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedWallpaper(wallpapers[currentIndex - 1])
    } else if (direction === 'next' && currentIndex < wallpapers.length - 1) {
      setSelectedWallpaper(wallpapers[currentIndex + 1])
    }
  }

  const currentIndex = selectedWallpaper
    ? wallpapers.findIndex(w => w.id === selectedWallpaper.id)
    : -1

  return (
    <>
      <WallpaperGrid wallpapers={wallpapers} onPreview={handlePreview} />
      <WallpaperPreviewModal
        wallpaper={selectedWallpaper}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onNavigate={handleNavigate}
        canNavigatePrev={currentIndex > 0}
        canNavigateNext={currentIndex >= 0 && currentIndex < wallpapers.length - 1}
      />
    </>
  )
}
