import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface WallpaperPreviewModalProps {
  wallpaper: {
    id: string
    title: string
    imageUrl: string
    category: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export default function WallpaperPreviewModal({ wallpaper, isOpen, onClose }: WallpaperPreviewModalProps) {
  if (!wallpaper) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{wallpaper.title}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full">
          <Image src={wallpaper.imageUrl || "/placeholder.svg"} alt={wallpaper.title} fill className="object-contain" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">{wallpaper.category}</span>
          <Button onClick={() => window.open(wallpaper.imageUrl, "_blank")}>Download</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

