import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Wallpaper } from "@/types/wallpaper"

interface WallpaperPreviewModalProps {
  wallpaper: Wallpaper | null
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
          <p className="text-muted-foreground mt-2">{wallpaper.description}</p>
        </DialogHeader>
        <div className="relative aspect-video w-full">
          <Image src={wallpaper.imageUrl || "/placeholder.svg"} alt={wallpaper.title} fill className="object-contain" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">{wallpaper.category}</span>
          <Button onClick={async () => {
            try {
              const response = await fetch(wallpaper.imageUrl);
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${wallpaper.title}.jpg`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error('Download failed:', error);
            }
          }}>Download</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

