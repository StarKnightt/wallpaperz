"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"
import { saveAs } from "file-saver"
import { LocalStorageImage } from "@/lib/localStorageService"

export default function GenerationHistory() {
  const [images, setImages] = useState<LocalStorageImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        const storedImages = localStorage.getItem("wallpaperz_generated_images")
        if (storedImages) {
          const parsedImages = JSON.parse(storedImages) as LocalStorageImage[]
          // Sort by creation date, newest first
          setImages(parsedImages.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA
          }))
        }
      } catch (error) {
        console.error("Error loading images from localStorage:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  const handleDownload = async (image: LocalStorageImage) => {
    try {
      const response = await fetch(image.imageUrl)
      const blob = await response.blob()
      saveAs(blob, `wallpaperz-${image.id}.png`)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleDelete = (id: string) => {
    try {
      const updatedImages = images.filter(img => img.id !== id)
      setImages(updatedImages)
      localStorage.setItem("wallpaperz_generated_images", JSON.stringify(updatedImages))
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">You haven't generated any images yet.</p>
        <Button className="mt-4" asChild>
          <a href="/ai-generate">Generate Your First Image</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group rounded-lg overflow-hidden border bg-card">
          <div className="aspect-video relative">
            <Image
              src={image.imageUrl}
              alt={image.prompt || "Generated image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="p-3">
            <p className="text-sm line-clamp-2 text-muted-foreground mb-2">
              {image.prompt || "No prompt available"}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {image.createdAt 
                  ? new Date(image.createdAt).toLocaleDateString() 
                  : "Unknown date"}
              </span>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload(image)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 