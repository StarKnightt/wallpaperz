import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Wallpaper } from "@/types/wallpaper"
import Image from "next/image"
import { Button } from "./ui/button"
import { Download } from "lucide-react"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  wallpaper: Wallpaper
}

export default function PreviewModal({ isOpen, onClose, wallpaper }: PreviewModalProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(wallpaper.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `wallpaper-${wallpaper.id || Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{wallpaper.title}</DialogTitle>
          <DialogDescription>
            High quality wallpaper preview
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={wallpaper.imageUrl}
            alt={wallpaper.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {wallpaper.source ? `Source: ${wallpaper.source}` : ""}
          </div>
          <Button 
            variant="default"
            onClick={handleDownload}
            className="bg-white text-black hover:bg-white/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 