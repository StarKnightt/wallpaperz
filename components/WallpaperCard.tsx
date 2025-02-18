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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut",
        layout: { duration: 0.3 }
      }}
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={wallpaper.imageUrl}
            alt={wallpaper.title}
            fill
            loading="lazy"
            className="object-cover transform transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR"
          />
        </motion.div>

        {/* Overlay with improved animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Buttons with staggered animation */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 flex gap-2"
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            variant="secondary"
            className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={onPreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            variant="secondary"
            className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}