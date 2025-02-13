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
    category: "Anime",
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
  {
    id: "8",
    title: "A boy drinking smoothie",
    imageUrl: "https://ik.imagekit.io/starknight/Anime/2.jpeg?updatedAt=1738950341390",
    category: "Anime",
    description: "Boy drinking smoothie with his pet" 
  },
  {
    id: "9",
    title: "A Hot Air Balloon In the sky",
    imageUrl: "https://ik.imagekit.io/starknight/Art/8.jpg?updatedAt=1739367163746",
    category: "Abstract",
    description: "A beautiful wallpaper of hot air balloon" 
  },
  {
    id: "10",
    title: "Night on an island",
    imageUrl: "https://ik.imagekit.io/starknight/Art/11.jpg?updatedAt=1739366813575",
    category: "Abstract",
    description: "A Scary and thriling view of night on an island" 
  },
  {
    id: "11",
    title: "Nature beauty reflected in the sky mountains and water",
    imageUrl: "https://ik.imagekit.io/starknight/Art/9.jpg?updatedAt=1739366820464",
    category: "Abstract",
    description: "Nature's beauty is incredible" 
  },
  {
    id: "12",
    title: "Mountain forest jungle trees cartoon background",
    imageUrl: "https://ik.imagekit.io/starknight/Art/12.jpg?updatedAt=1739366820811",
    category: "Abstract",
    description: "Mountain forest jungles are always beautiful" 
  },
  {
    id: "13",
    title: "Futuristic half-robot tiger",
    imageUrl: "https://ik.imagekit.io/starknight/Art/15.jpg?updatedAt=1739366821818",
    category: "Abstract",
    description: "half-robot tiger wallpaper" 
  },
  {
    id: "14",
    title: "Nature beauty reflected in the sky mountains and water",
    imageUrl: "https://ik.imagekit.io/starknight/Art/10.jpg?updatedAt=1739366822955",
    category: "Abstract",
    description: "Nature's beauty is truly fanstastic." 
  },
  {
    id: "15",
    title: "3d flower boho render",
    imageUrl: "https://ik.imagekit.io/starknight/Art/14.jpg?updatedAt=1739366823814",
    category: "Abstract",
    description: "Flower's can be rendered on 3D" 
  },
  {
    id: "16",
    title: "Half-robot tiger in a garden",
    imageUrl: "https://ik.imagekit.io/starknight/Art/16.jpg?updatedAt=1739366825731",
    category: "Abstract",
    description: "A futuristic tiger walking on red garden." 
  },
  {
    id: "17",
    title: "Fantasy fish made of plastic",
    imageUrl: "https://ik.imagekit.io/starknight/Art/17.jpg?updatedAt=1739366827501",
    category: "Abstract",
    description: "A fish which is from future." 
  },
  {
    id: "18",
    title: "A girl walking on the road alone",
    imageUrl: "https://ik.imagekit.io/starknight/Anime/18.jpg?updatedAt=1739463580903",
    category: "Anime",
    description: "Girl walking on the road alone in a forest" 
  },
  {
    id: "19",
    title: "A van is going on a mountain",
    imageUrl: "https://ik.imagekit.io/starknight/Anime/22.jpg?updatedAt=1739463581145",
    category: "Anime",
    description: "Van is going the mountain" 
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
