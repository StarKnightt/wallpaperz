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
  return (
    <motion.div 
      className="group relative rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="aspect-[16/10] relative">
        <Image
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Overlay gradient with blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] group-hover:backdrop-blur-[4px]" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
            onClick={onPreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

