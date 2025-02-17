export type WallpaperCategory = "Abstract" | "Anime" // Only include categories we're actually using

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

export interface Favorite {
  id: string
  wallpaperId: string
  userId: string
  createdAt: Date
}

// Update User type
export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string | null
  favorites?: Favorite[]
}