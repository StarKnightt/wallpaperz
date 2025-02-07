import { Wallpaper, WallpaperCollection } from "@/types/wallpaper"

export const allWallpapers: Wallpaper[] = [
  {
    id: "1",
    title: "Girl-Thinking about it",
    imageUrl: "https://ik.imagekit.io/starknight/Girl-thinking.jpg",
    category: "Anime",
    description: "Peaceful mountain landscape at sunset"
  },
  {
    id: "2",
    title: "Abstract Art",
    imageUrl: "https://ik.imagekit.io/starknight/Motivation/motivation.png",
    category: "Abstract",
    description: "Colorful abstract digital art composition"
  },
  // Add more wallpapers...
]

// Optional: Organize by collections
export const collections = {
  featured: allWallpapers.slice(0, 4),
  nature: allWallpapers.filter(w => w.category === "Nature"),
  abstract: allWallpapers.filter(w => w.category === "Abstract"),
  // Add more collections...
}

// Helper to get wallpapers by category
export const getWallpapersByCategory = (category: string) => {
  return allWallpapers.filter(w => w.category === category)
}
