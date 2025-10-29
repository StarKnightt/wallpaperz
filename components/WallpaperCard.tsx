"use client"
import { useState, useRef } from "react"
import { Wallpaper } from "@/types/wallpaper"
import Image from "next/image"
import { Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { getImageUrl } from "@/lib/imagekit"
import { toast } from "sonner"

interface WallpaperCardProps {
  wallpaper: Wallpaper
  onPreview: () => void
}

export default function WallpaperCard({ wallpaper, onPreview }: WallpaperCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePosition({ x, y })
  }

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      toast.info('Preparing download...')
      const imageUrl = getImageUrl(wallpaper.imageUrl)
      const response = await fetch(imageUrl)
      
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `wallpaper-${wallpaper.id || Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Wallpaper downloaded successfully!')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download wallpaper. Please try again.')
    }
  }

  return (
    <motion.div 
      ref={cardRef}
      className="group relative rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`
      }}
    >
      {/* Shine effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, transparent 50%)`,
          transition: 'opacity 0.3s'
        }}
      />

      {/* Card content */}
      <div className="aspect-[16/10] relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={getImageUrl(wallpaper.imageUrl)}
            alt={wallpaper.title}
            fill
            loading="lazy"
            className="object-cover transform transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            quality={75}
          />
        </motion.div>

        {/* Enhanced overlay with shine */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`
            }}
          />
        </motion.div>

        {/* Enhanced buttons */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 flex gap-2"
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            variant="secondary"
            className="flex-1 bg-white text-black hover:bg-white/90 backdrop-blur-sm relative overflow-hidden"
            onClick={onPreview}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            variant="secondary"
            className="flex-1 bg-white text-black hover:bg-white/90 backdrop-blur-sm relative overflow-hidden"
            onClick={handleDownload}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}