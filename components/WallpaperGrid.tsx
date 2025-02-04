import WallpaperCard from "./WallpaperCard"

interface Wallpaper {
  id: string
  title: string
  imageUrl: string
  category: string
}

interface WallpaperGridProps {
  wallpapers: Wallpaper[]
  onPreview: (wallpaper: Wallpaper) => void
}

export default function WallpaperGrid({ wallpapers, onPreview }: WallpaperGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard 
          key={wallpaper.id} 
          wallpaper={wallpaper}
          onPreview={() => onPreview(wallpaper)}
        />
      ))}
    </div>
  )
}
