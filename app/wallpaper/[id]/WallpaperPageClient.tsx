"use client"

import { useState } from "react"
import { Wallpaper } from "@/types/wallpaper"
import { Button } from "@/components/ui/button"
import { Download, Share2, X, ZoomIn } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { getBlurDataURLClient } from "@/lib/blur-placeholder"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  wallpaper: Wallpaper
  imageUrl: string
}

export default function WallpaperPageClient({ wallpaper, imageUrl }: Props) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownload = async () => {
    try {
      toast.info("Preparing download...")
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error("Failed to fetch image")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${wallpaper.title}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success("Downloaded!")
    } catch {
      toast.error("Download failed. Please try again.")
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/wallpaper/${wallpaper.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: wallpaper.title, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied!")
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied!")
    }
  }

  return (
    <>
      <div
        className="relative aspect-[16/10] rounded-lg overflow-hidden border cursor-pointer group"
        onClick={() => setIsPreviewOpen(true)}
      >
        <Image
          src={imageUrl}
          alt={wallpaper.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          placeholder="blur"
          blurDataURL={getBlurDataURLClient()}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Button onClick={handleDownload} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[95vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={wallpaper.title}
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
