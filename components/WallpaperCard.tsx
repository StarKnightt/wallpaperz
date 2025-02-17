import { Wallpaper } from "@/types/wallpaper"
import Image from "next/image"
import { Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface WallpaperCardProps {
  wallpaper: Wallpaper
  onPreview: () => void
}

export default function WallpaperCard({ wallpaper, onPreview }: WallpaperCardProps) {
  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const response = await fetch(wallpaper.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `wallpaper-${wallpaper.id || Date.now()}.jpg`
      // Append to body and click programmatically
      document.body.appendChild(link)
      link.click()
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      // Optionally show an error toast here
    }
  }

  return (
    <motion.div 
      className="group relative rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.preventDefault()} // Prevent any parent clicks
    >
      {/* Image */}
      <div className="aspect-[16/10] relative">
        <Image
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          fill
          loading="lazy"
          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR"
        />
        
        {/* Overlay gradient with blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="flex-1 bg-white dark:bg-white/20 text-gray-800 dark:text-white backdrop-blur-sm hover:bg-gray-200 dark:hover:bg-white/30 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onPreview()
            }}
            aria-label="Preview wallpaper"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className="flex-1 bg-white dark:bg-white/20 text-gray-800 dark:text-white backdrop-blur-sm hover:bg-gray-200 dark:hover:bg-white/30 transition-all duration-300"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </motion.div>
  )
}