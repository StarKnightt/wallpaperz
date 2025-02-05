import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getImageKitUrl } from "@/lib/imagkit"
import { Wallpaper } from "@/types/wallpaper"

interface WallpaperCardProps {
  wallpaper: Wallpaper
  onPreview: (wallpaper: Wallpaper) => void
}

export default function WallpaperCard({ wallpaper, onPreview }: WallpaperCardProps) {
  const optimizedImageUrl = getImageKitUrl(wallpaper.imageUrl, 300, 200)

  return (
    <Card className="overflow-hidden cursor-pointer" onClick={() => onPreview(wallpaper)}>
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <Image
            src={optimizedImageUrl || "/placeholder.svg"}
            alt={wallpaper.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{wallpaper.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{wallpaper.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{wallpaper.category}</span>
            <Button
              size="sm"
              onClick={async (e) => {
                e.stopPropagation();
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
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

