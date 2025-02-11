import { Wallpaper } from "@/types/wallpaper"
import { motion } from "framer-motion"
import WallpaperCard from "./WallpaperCard"

interface WallpaperGridProps {
  wallpapers: Wallpaper[]
  onPreview: (wallpaper: Wallpaper) => void
}

export default function WallpaperGrid({ wallpapers, onPreview }: WallpaperGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 max-w-6xl mx-auto w-full">
      {wallpapers.map((wallpaper) => (
        <motion.div
          key={wallpaper.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 dark:bg-white/5 backdrop-blur-sm p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
