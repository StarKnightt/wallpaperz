import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getImageKitUrl } from "@/lib/imagkit"
import WallpaperCard from "./WallpaperCard"

interface Wallpaper {
  id: string
  title: string
  imageUrl: string
  category: string
}

interface WallpaperGridProps {
  wallpapers: Wallpaper[]
  onPreview: (wallpaper: Wallpaper) => void
}

export default function WallpaperGrid({ wallpapers, onPreview }: WallpaperGridProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
    onPreview(wallpaper)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setSelectedWallpaper(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard 
            key={wallpaper.id} 
            wallpaper={wallpaper}
            onPreview={() => handlePreview(wallpaper)}
          />
        ))}
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-4xl">
          {selectedWallpaper && (
            <div className="relative aspect-[16/9]">
              <img
                src={getImageKitUrl(selectedWallpaper.imageUrl, 1920, 1080)}
                alt={selectedWallpaper.title}
                className="w-full h-full object-cover rounded-lg"
                loading="eager"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
