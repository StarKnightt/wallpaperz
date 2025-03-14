"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LocalStorageWarning() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Check if the user has dismissed the warning before
    const hasSeenWarning = localStorage.getItem("wallpaperz_storage_warning_seen")
    
    if (!hasSeenWarning) {
      // Show the warning after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [])
  
  const dismissWarning = () => {
    setIsVisible(false)
    // Remember that the user has seen the warning
    localStorage.setItem("wallpaperz_storage_warning_seen", "true")
  }
  
  if (!isVisible) return null
  
  return (
    <div className={cn(
      "fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 p-4 rounded-lg shadow-lg border bg-background/95 backdrop-blur-sm transition-all duration-300",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
    )}>
      <button 
        onClick={dismissWarning}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-sm mb-1">Local Storage Notice</h3>
          <p className="text-xs text-muted-foreground">
            Wallpaperz stores your generated images in your browser's local storage. 
            Images are not saved on our servers and will be lost if you clear your browser data.
          </p>
          <button
            onClick={dismissWarning}
            className="text-xs text-primary hover:text-primary/80 mt-2 font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
} 