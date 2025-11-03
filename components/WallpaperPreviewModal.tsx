"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Link as LinkIcon, Download, Loader2, X, ArrowLeft, ArrowRight, Info } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Wallpaper } from "@/types/wallpaper"
import { useState, useEffect } from "react"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { getImageUrl } from '@/lib/imagekit'
import { getBlurDataURLClient, getImageMetadata, ImageMetadata, getResolutionName } from '@/lib/blur-placeholder'

interface WallpaperPreviewModalProps {
  wallpaper: Wallpaper | null
  isOpen: boolean
  onClose: () => void
  onNavigate?: (direction: 'prev' | 'next') => void
  canNavigatePrev?: boolean
  canNavigateNext?: boolean
}

export default function WallpaperPreviewModal({ 
  wallpaper, 
  isOpen, 
  onClose, 
  onNavigate,
  canNavigatePrev = false,
  canNavigateNext = false 
}: WallpaperPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [metadata, setMetadata] = useState<ImageMetadata>({})
  const [showMetadata, setShowMetadata] = useState(false)

  useEffect(() => {
    if (isOpen && wallpaper) {
      setIsLoading(true)
      setMetadata({})
      
      const imageUrl = getImageUrl(wallpaper.imageUrl)
      getImageMetadata(imageUrl).then(setMetadata)
    }
  }, [wallpaper, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && canNavigatePrev && onNavigate) {
        onNavigate('prev')
      } else if (e.key === 'ArrowRight' && canNavigateNext && onNavigate) {
        onNavigate('next')
      } else if (e.key === 'i' || e.key === 'I') {
        setShowMetadata(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNavigate, canNavigatePrev, canNavigateNext])

  if (!wallpaper) return null

  const imageUrl = getImageUrl(wallpaper.imageUrl)

  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}?wallpaper=${wallpaper.id}`
    const text = `Check out this amazing wallpaper: ${wallpaper.title}`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')
        toast.success("Opened Facebook share dialog")
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')
        toast.success("Opened Twitter share dialog")
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`, '_blank')
        toast.success("Opened WhatsApp")
        break
      case 'copy':
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied to clipboard!")
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogClose className="absolute right-4 top-4 z-50">
          <div className="rounded-full p-2 bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90 transition-colors">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </div>
        </DialogClose>

        <DialogHeader className="p-4">
          <DialogTitle className="sr-only">
            {wallpaper.title}
          </DialogTitle>
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
          {onNavigate && canNavigatePrev && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={() => onNavigate('prev')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {onNavigate && canNavigateNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={() => onNavigate('next')}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}

          <Image 
            src={imageUrl || "/placeholder.svg"} 
            alt={wallpaper.title} 
            fill 
            className="object-contain"
            onLoad={() => setIsLoading(false)}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            loading="eager"
            placeholder="blur"
            blurDataURL={getBlurDataURLClient()}
          />

          {showMetadata && (wallpaper.width || metadata.format) && (
            <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1 z-20">
              {wallpaper.width && wallpaper.height && (
                <p className="font-mono">
                  <span className="font-semibold">Quality:</span> {getResolutionName(wallpaper.width, wallpaper.height)}
                </p>
              )}
              {metadata.format && (
                <p className="font-mono">
                  <span className="font-semibold">Format:</span> {metadata.format}
                </p>
              )}
            </div>
          )}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetadata(!showMetadata)}
                title="Toggle metadata (or press 'I')"
              >
                <Info className="h-4 w-4 mr-2" />
                Info
              </Button>
            </div>

            <Button 
              size="sm"
              className="w-full sm:w-auto"
              onClick={async () => {
                try {
                  toast.info('Preparing download...')
                  const response = await fetch(imageUrl);
                  
                  if (!response.ok) {
                    throw new Error('Failed to fetch image')
                  }
                  
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${wallpaper.title}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                  
                  toast.success('Wallpaper downloaded successfully!')
                } catch (error) {
                  console.error('Download failed:', error);
                  toast.error('Failed to download wallpaper. Please try again.')
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