export type WallpaperCategory = "Abstract" | "Anime" | "Art" | "Cars" | "City" | "Fantasy" | "Nature" | "Space" | "Technology" | "Other" | "Minimalist" | "4k"

export interface Wallpaper {
  id: string
  title: string
  imageUrl: string
  category: WallpaperCategory
  description: string
  source: string;    
  sourceUrl?: string; 
  width?: number    
  height?: number   
  fileSize?: number  
}