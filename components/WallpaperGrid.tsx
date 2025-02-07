import { Wallpaper } from "@/types/wallpaper"
import { motion } from "framer-motion"
import WallpaperCard from "./WallpaperCard"

interface WallpaperGridProps {
  wallpapers: Wallpaper[]
  onPreview: (wallpaper: Wallpaper) => void
}

export default function WallpaperGrid({ wallpapers, onPreview }: WallpaperGridProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {wallpapers.map((wallpaper, index) => (
        <motion.div
          key={wallpaper.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4,
            delay: (index % 8) * 0.1 // Only animate new items
          }}
        >
          <WallpaperCard 
            wallpaper={wallpaper}
            onPreview={() => onPreview(wallpaper)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
