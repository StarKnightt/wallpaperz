"use client"
import { Wallpaper } from "@/types/wallpaper"
import Image from "next/image"
import { motion } from "framer-motion"
import { getImageUrl } from '@/lib/imagekit'


interface Props {
  wallpapers: Wallpaper[]
  onPreview: (wallpaper: Wallpaper) => void
  isLoading?: boolean
}

export default function WallpaperGrid({ wallpapers, onPreview, isLoading = false }: Props) {
  if (isLoading) {
    return <LoadingSkeleton />
  }

  const wallpaperCards = wallpapers.map((wallpaper, index) => {
    const isLarge = index % 8 === 0
    const isMedium = index % 6 === 3
    const isMobileFull = index % 3 === 0
    
    const gridClass = `
      ${isMobileFull ? "col-span-2 sm:col-span-1" : ""} 
      ${isLarge ? "md:col-span-2 md:row-span-2" : ""} 
      ${isMedium ? "md:col-span-2" : ""}
    `.trim()

    return (
      <motion.div
        key={wallpaper.id}
        className={`relative rounded-xl overflow-hidden group cursor-pointer ${gridClass}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -5 }}
        onClick={() => onPreview(wallpaper)}
      >
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={getImageUrl(wallpaper.imageUrl)}
            alt={wallpaper.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes={`
              (max-width: 640px) ${isMobileFull ? '100vw' : '50vw'},
              (max-width: 1024px) ${isLarge || isMedium ? '66vw' : '33vw'},
              ${isLarge || isMedium ? '50vw' : '25vw'}
            `}
            loading={index < 6 ? "eager" : "lazy"}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">{wallpaper.title}</h3>
        </div>

        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full pointer-events-none">
          {wallpaper.category}
        </div>
      </motion.div>
    )
  })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4" style={{ gridAutoFlow: 'dense' }}>
      {wallpaperCards}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4" style={{ gridAutoFlow: 'dense' }}>
      {[...Array(8)].map((_, i) => {
        const isMobileFull = i % 3 === 0
        const gridClass = `
          ${isMobileFull ? "col-span-2 sm:col-span-1" : ""} 
          ${i % 8 === 0 ? "md:col-span-2 md:row-span-2" : ""} 
          ${i % 6 === 3 ? "md:col-span-2" : ""}
        `.trim()

        return (
          <div 
            key={i} 
            className={`relative rounded-xl overflow-hidden bg-muted animate-pulse ${gridClass}`}
          />
        )
      })}
    </div>
  )
}
