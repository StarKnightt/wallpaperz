"use client"

import { ReactNode, useMemo, useState } from "react"
import WallpaperGrid from "@/components/WallpaperGrid"
import WallpaperPreviewModal from "@/components/WallpaperPreviewModal"
import DeviceFilter, { DeviceFilterValue, isPortraitWallpaper, matchesDeviceFilter } from "@/components/DeviceFilter"
import { Wallpaper } from "@/types/wallpaper"

interface Props {
  /** The current page's slice - server-rendered so every card is in the HTML */
  wallpapers: Wallpaper[]
  /** Optional heading block rendered on the same row as the device filter */
  heading?: ReactNode
  showDeviceFilter?: boolean
  /** Controlled device filter; omit to let the component manage it */
  device?: DeviceFilterValue
  onDeviceChange?: (value: DeviceFilterValue) => void
}

// Client shell around the grid for paginated list pages. The wallpaper slice
// comes from the server component; the Desktop/Mobile toggle filters WITHIN
// the current page on the client (orientation-specific slices would need
// query strings, which can't be prerendered on the Workers free plan).
export default function WallpaperListingClient({
  wallpapers,
  heading,
  showDeviceFilter = true,
  device: controlledDevice,
  onDeviceChange,
}: Props) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [internalDevice, setDevice] = useState<DeviceFilterValue>("all")
  const device = controlledDevice ?? internalDevice

  const visible = useMemo(
    () => wallpapers.filter((w) => matchesDeviceFilter(w, device)),
    [wallpapers, device]
  )

  const counts = useMemo(() => ({
    all: wallpapers.length,
    mobile: wallpapers.filter(isPortraitWallpaper).length,
    desktop: wallpapers.filter((w) => !isPortraitWallpaper(w)).length,
  }), [wallpapers])

  const handleDeviceChange = (value: DeviceFilterValue) => {
    setDevice(value)
    onDeviceChange?.(value)
  }

  const handlePreview = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    setIsPreviewOpen(true)
  }

  const currentIndex = selectedWallpaper ? visible.findIndex((w) => w.id === selectedWallpaper.id) : -1

  const handleNavigate = (direction: "prev" | "next") => {
    if (currentIndex === -1) return
    if (direction === "prev" && currentIndex > 0) setSelectedWallpaper(visible[currentIndex - 1])
    else if (direction === "next" && currentIndex < visible.length - 1) setSelectedWallpaper(visible[currentIndex + 1])
  }

  return (
    <>
      {(heading || showDeviceFilter) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>{heading}</div>
          {showDeviceFilter && <DeviceFilter value={device} onChange={handleDeviceChange} counts={counts} />}
        </div>
      )}

      {visible.length > 0 ? (
        <WallpaperGrid wallpapers={visible} onPreview={handlePreview} />
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No {device === "mobile" ? "phone" : "desktop"} wallpapers on this page. Try the next page or switch back to All.
          </p>
        </div>
      )}

      <WallpaperPreviewModal
        wallpaper={selectedWallpaper}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onNavigate={handleNavigate}
        canNavigatePrev={currentIndex > 0}
        canNavigateNext={currentIndex >= 0 && currentIndex < visible.length - 1}
      />
    </>
  )
}
