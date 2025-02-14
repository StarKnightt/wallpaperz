import { Wallpaper } from "@/types/wallpaper"
import { motion } from "framer-motion"
import WallpaperCard from "./WallpaperCard"
import { cn } from "@/lib/utils"

interface WallpaperGridProps {
  wallpapers: Wallpaper[]
  onPreview: (wallpaper: Wallpaper) => void
  isLoading?: boolean
}

export default function WallpaperGrid({ 
  wallpapers, 
  onPreview, 
  isLoading = false 
}: WallpaperGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 container mx-auto">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 dark:bg-white/5 backdrop-blur-sm p-2 rounded-xl overflow-hidden"
          >
            <div className="animate-pulse">
              <div className="aspect-[16/9] bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg" />
              <div className="mt-4 flex gap-2">
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded flex-1" />
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 container mx-auto">
      {wallpapers.map((wallpaper) => (
        <motion.div
          key={wallpaper.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 dark:bg-white/5 backdrop-blur-sm p-2 rounded-lg hover:shadow-xl transition-all duration-300"
          layout
        >
          <WallpaperCard 
            wallpaper={wallpaper}
            onPreview={() => onPreview(wallpaper)}
          />
        </motion.div>
      ))}
    </div>
  )
}
