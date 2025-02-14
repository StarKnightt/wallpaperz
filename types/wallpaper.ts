export type WallpaperCategory = "Photography" | "Nature" | "Urban" | "Abstract" | "Minimalist" | "Colorful" | "Anime"

export interface Wallpaper {
  id: string
  title: string
  imageUrl: string
  category: WallpaperCategory
  description: string
  source: string;    // 'pexels' | 'pixabay' | 'unsplash'
  sourceUrl?: string; // optional link to original
}

export interface WallpaperCollection {
  id: string
  name: string
  description: string
  thumbnail: string
  wallpapers: Wallpaper[]
}