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
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4" // Changed grid and spacing
    >
      {wallpapers.map((wallpaper, index) => (
        <motion.div
          key={wallpaper.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4,
            delay: (index % 6) * 0.1
          }}
          className="bg-white/5 dark:bg-white/5 backdrop-blur-sm p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" // Added premium border effect
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
