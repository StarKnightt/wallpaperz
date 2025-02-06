"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Link as LinkIcon, Download } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Wallpaper } from "@/types/wallpaper"

interface WallpaperPreviewModalProps {
  wallpaper: Wallpaper | null
  isOpen: boolean
  onClose: () => void
}

export default function WallpaperPreviewModal({ wallpaper, isOpen, onClose }: WallpaperPreviewModalProps) {
  if (!wallpaper) return null

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const text = `Check out this amazing wallpaper: ${wallpaper.title}`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)
        break
      case 'copy':
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{wallpaper.title}</DialogTitle>
          <p className="text-muted-foreground mt-2">{wallpaper.description}</p>
        </DialogHeader>
        
        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
          <Image 
            src={wallpaper.imageUrl || "/placeholder.svg"} 
            alt={wallpaper.title} 
            fill 
            className="object-contain transition-transform hover:scale-105"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Tweet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('copy')}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <Button 
            variant="default"
            size="sm"
            onClick={async () => {
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
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

