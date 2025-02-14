"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Link as LinkIcon, Download, Loader2, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Wallpaper } from "@/types/wallpaper"
import { useState } from "react"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface WallpaperPreviewModalProps {
  wallpaper: Wallpaper | null
  isOpen: boolean
  onClose: () => void
}

export default function WallpaperPreviewModal({ wallpaper, isOpen, onClose }: WallpaperPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true)

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
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        {/* Add floating close button */}
        <DialogClose className="absolute right-4 top-4 z-50">
          <div className="rounded-full p-2 bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90 transition-colors">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </div>
        </DialogClose>

        <DialogHeader className="sr-only">
          <DialogTitle>{wallpaper.title}</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}

        <div className="relative aspect-[16/9] w-full">
          <Image 
            src={wallpaper.imageUrl || "/placeholder.svg"} 
            alt={wallpaper.title} 
            fill 
            className="object-contain"
            onLoadingComplete={() => setIsLoading(false)}
            onLoad={() => setIsLoading(false)}
            priority
            sizes="100vw"
            loading="eager"
          />
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{wallpaper.title}</h3>
            <p className="text-muted-foreground text-sm">{wallpaper.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
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
              size="sm"
              className="w-full sm:w-auto"
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

