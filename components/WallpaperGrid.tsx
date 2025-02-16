import { Wallpaper } from "@/types/wallpaper"
import Image from "next/image"
import { motion } from "framer-motion"
import { getImageUrl } from '@/lib/imagekit'

interface Props {
  wallpapers: Wallpaper[]
  onPreview: (wallpaper: Wallpaper) => void
  isLoading?: boolean
}

export default function WallpaperGrid({ 
  wallpapers, 
  onPreview, 
  isLoading = false 
}: Props) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {wallpapers.map((wallpaper) => (
        <motion.div 
          key={wallpaper.id}
          className="relative aspect-[16/9] overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => onPreview(wallpaper)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={getImageUrl(wallpaper.imageUrl)}
            alt={wallpaper.title || 'Wallpaper'}
            fill
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </motion.div>
      ))}
    </div>
  )
}
