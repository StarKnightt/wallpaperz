export interface Wallpaper {
  id: string
  title: string
  imageUrl: string
  category: WallpaperCategory
  description: string
}

export type WallpaperCategory = "Photography" | "Nature" | "Urban" | "Abstract" | "Minimalist" | "Colorful"