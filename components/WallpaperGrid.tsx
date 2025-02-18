"use client"
import { Wallpaper } from "@/types/wallpaper"
import Image from "next/image"
import { motion } from "framer-motion"
import { getImageUrl } from '@/lib/imagekit'
import { Button } from "./ui/button"
import { Eye, Download } from "lucide-react"

interface Props {
  wallpapers: Wallpaper[]
  onPreview: (wallpaper: Wallpaper) => void
  isLoading?: boolean
}

export default function WallpaperGrid({ wallpapers, onPreview, isLoading = false }: Props) {
  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
      {wallpapers.map((wallpaper, index) => {
        // Desktop sizing (16:9 aspect ratio focus)
        const isLarge = index % 5 === 0 // Every 5th item is large
        const isMedium = index % 7 === 3 // Every 7th item is medium

        // Mobile sizing (more compact)
        const isMobileFull = index % 3 === 0 // Every 3rd item spans full width on mobile
        
        const gridClass = `
          ${isMobileFull ? "col-span-2 sm:col-span-1" : ""} 
          ${isLarge ? "md:col-span-2 md:row-span-2" : ""} 
          ${isMedium ? "md:col-span-2" : ""}
        `.trim()

        return (
          <motion.div
            key={wallpaper.id}
            className={`relative rounded-xl overflow-hidden group ${gridClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={getImageUrl(wallpaper.imageUrl)}
                alt={wallpaper.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes={`
                  (max-width: 640px) ${isMobileFull ? '100vw' : '50vw'},
                  (max-width: 1024px) ${isLarge || isMedium ? '50vw' : '33vw'},
                  25vw
                `}
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Content - Adjusted for better mobile display */}
            <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
              <h3 className="text-white font-semibold text-sm md:text-base mb-2 line-clamp-2">{wallpaper.title}</h3>
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-xs md:text-sm"
                  onClick={() => onPreview(wallpaper)}
                >
                  <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
                <Button 
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-xs md:text-sm"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
      {[...Array(8)].map((_, i) => {
        const isMobileFull = i % 3 === 0
        const gridClass = `
          ${isMobileFull ? "col-span-2 sm:col-span-1" : ""} 
          ${i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""} 
          ${i % 7 === 3 ? "md:col-span-2" : ""}
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
