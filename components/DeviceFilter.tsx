"use client"

import { Monitor, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Wallpaper } from "@/types/wallpaper"

export type DeviceFilterValue = "all" | "desktop" | "mobile"

// Same orientation logic as the WallpaperGrid bento cells / Smartphone badge
export const isPortraitWallpaper = (w: Wallpaper) =>
  !!(w.width && w.height && w.height > w.width)

export function matchesDeviceFilter(w: Wallpaper, device: DeviceFilterValue) {
  if (device === "all") return true
  return device === "mobile" ? isPortraitWallpaper(w) : !isPortraitWallpaper(w)
}

const OPTIONS: { value: DeviceFilterValue; label: string; icon?: typeof Monitor }[] = [
  { value: "all", label: "All" },
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "mobile", label: "Mobile", icon: Smartphone },
]

interface DeviceFilterProps {
  value: DeviceFilterValue
  onChange: (value: DeviceFilterValue) => void
  counts?: Record<DeviceFilterValue, number>
}

export default function DeviceFilter({ value, onChange, counts }: DeviceFilterProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Filter wallpapers by device">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            value === option.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
        >
          {option.icon && <option.icon className="h-3.5 w-3.5" />}
          {option.label}
          {counts && (
            <span className="text-xs opacity-70 tabular-nums">{counts[option.value]}</span>
          )}
        </button>
      ))}
    </div>
  )
}
