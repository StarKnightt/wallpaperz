import { Wallpaper, WallpaperCollection } from "@/types/wallpaper"

export const allWallpapers: Wallpaper[] = [
  {
    id: "1",
    title: "Girl-Thinking about it",
    imageUrl: "https://ik.imagekit.io/starknight/Anime/6.jpg?updatedAt=1738951216228",
    category: "Anime",
    description: "Peaceful mountain landscape at sunset"
  },
  {
    id: "2",
    title: "Flash Logo 4k",
    imageUrl: "https://ik.imagekit.io/starknight/Art/1.jpg?updatedAt=1738950598212",
    category: "Abstract",
    description: "A logo of flash wallpaper"
  },
  {
    id: "3",
    title: "4k Flower wallpaper",
    imageUrl: "https://ik.imagekit.io/starknight/Art/5.jpg?updatedAt=1738950784247",
    category: "Abstract",
    description: "An abstract flower wallpaper" 
  },
  {
    id: "5",
    title: "Finally Fantasty Rebirth",
    imageUrl: "https://ik.imagekit.io/starknight/Anime/3.jpeg?updatedAt=1738950341010",
    category: "Abstract",
    description: "An abstract flower wallpaper" 
  },
  {
    id: "6",
    title: "Futuristic Windows wallpaper",
    imageUrl: "https://ik.imagekit.io/starknight/Art/7.png?updatedAt=1738951450391",
    category: "Abstract",
    description: "An futuristic wallpaper" 
  },
  {
    id: "7",
    title: "God with a programmer",
    imageUrl: "https://ik.imagekit.io/starknight/Art/8_JYkc21aIQ?updatedAt=1738951845182",
    category: "Abstract",
    description: "A programmer with god wallpaper" 
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
