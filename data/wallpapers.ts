import { Wallpaper, WallpaperCollection } from "@/types/wallpaper"

// Store only the path part, not the full URL
export const allWallpapers: Wallpaper[] = [
  {
    id: "2",
    title: "Sunset in a different way",
    imageUrl: "Art/1.jpg",
    category: "Abstract",
    description: "A stunning digital art interpretation of a sunset featuring vibrant colors and abstract elements. This modern artistic wallpaper combines warm sunset hues with contemporary design elements, ideal for creative workspaces.",
    source: "pexels"
  },
  {
    id: "3",
    title: "4k Flower wallpaper",
    imageUrl: "Art/5.jpg",
    category: "Abstract",
    description: "High-resolution 4K abstract flower artwork with intricate details and mesmerizing patterns. The vibrant colors and unique artistic style make it perfect for nature lovers and modern art enthusiasts.",
    source: "pexels"
  },
  {
    id: "6",
    title: "Futuristic Windows wallpaper",
    imageUrl: "Art/7.png",
    category: "Abstract",
    description: "Ultra-modern abstract wallpaper with a futuristic tech aesthetic. Perfect for desktop customization, featuring sleek geometric patterns and a cutting-edge design that complements any modern operating system.",
    source: "pexels"
  },
  {
    id: "7",
    title: "God with a programmer",
    imageUrl: "Art/8_JYkc21aIQ",
    category: "Abstract",
    description: "Artistic representation of divine inspiration in programming, featuring symbolic elements of technology and spirituality. A unique perspective on the creative process of coding, perfect for developers and tech enthusiasts.",
    source: "pexels"
  },
  {
    id: "9",
    title: "A Hot Air Balloon In the sky",
    imageUrl: "Art/8.jpg",
    category: "Abstract",
    description: "Enchanting abstract interpretation of a hot air balloon journey through surreal skies. The artwork combines whimsical elements with dramatic atmospheric effects, creating a perfect backdrop for those who dream of adventure and exploration.",
    source: "pexels"
  },
  {
    id: "10",
    title: "Night on an island",
    imageUrl: "Art/11.jpg",
    category: "Abstract",
    description: "Mysterious and atmospheric nighttime scene of an isolated island. This moody artwork captures the thrill of solitude and adventure, featuring deep shadows and ethereal lighting that creates an immersive nocturnal experience.",
    source: "pexels"
  },
  {
    id: "11",
    title: "Nature beauty reflected in the sky mountains and water",
    imageUrl: "Art/9.jpg",
    category: "Abstract",
    description: "Breathtaking landscape featuring perfect mirror reflections in crystal-clear waters. This serene composition showcases majestic mountains meeting sky, creating a symmetrical masterpiece that celebrates the raw beauty of natural landscapes.",
    source: "pexels"
  },
  {
    id: "12",
    title: "Mountain forest jungle trees cartoon background",
    imageUrl: "Art/12.jpg",
    category: "Abstract",
    description: "Stylized cartoon interpretation of a lush mountain forest landscape. The vibrant artwork features playful geometric shapes and bold colors, perfect for those who appreciate modern minimalist design with a nature-inspired twist.",
    source: "pexels"
  },
  {
    id: "13",
    title: "Futuristic half-robot tiger",
    imageUrl: "Art/15.jpg",
    category: "Abstract",
    description: "Striking cyberpunk-inspired artwork of a mechanically enhanced tiger. This unique fusion of nature and technology showcases intricate mechanical details and organic elements, appealing to fans of sci-fi and contemporary digital art.",
    source: "pexels"
  },
  {
    id: "14",
    title: "Nature beauty reflected in the sky mountains and water",
    imageUrl: "Art/10.jpg",
    category: "Abstract",
    description: "Spectacular panoramic view of mountain ranges reflecting in pristine waters. This high-resolution landscape captures the grandeur of natural mirrors, where sky meets earth in perfect harmony, ideal for nature enthusiasts and meditation spaces.",
    source: "pexels"
  },
  {
    id: "15",
    title: "3d flower boho render",
    imageUrl: "Art/14.jpg",
    category: "Abstract",
    description: "Contemporary 3D rendered floral artwork with bohemian aesthetic. This modern interpretation combines organic shapes with digital precision, featuring soft colors and intricate details that bring a touch of artistic sophistication to any screen.",
    source: "pexels"
  },
  {
    id: "16",
    title: "Half-robot tiger in a garden",
    imageUrl: "Art/16.jpg",
    category: "Abstract",
    description: "Surreal digital artwork featuring a biomechanical tiger in a vibrant red garden setting. This unique piece blends cyberpunk elements with natural beauty, creating an striking contrast between organic and mechanical forms.",
    source: "pexels"
  },
  {
    id: "17",
    title: "Fantasy fish made of plastic",
    imageUrl: "Art/17.jpg",
    category: "Abstract",
    description: "Innovative digital artwork depicting a translucent fish with plastic-like qualities. This contemporary piece raises awareness about ocean pollution while creating a hauntingly beautiful aesthetic, perfect for environmentally conscious art lovers.",
    source: "pexels"
  },
  {
    id: "30",
    title: "blue gradient wallpaper",
    imageUrl: "Art/gradiant_ONzR9fJIr.jpg",
    category: "Abstract",
    description: "A stunning blue gradient wallpaper with a smooth, seamless transition between colors. This modern design creates a calming and visually appealing background for any device, perfect for those who appreciate subtle, sophisticated color palettes.",
    source: "pexels"
  }
]

// Optional: Organize by collections
export const collections = {
  featured: allWallpapers.slice(0, 4),
  abstract: allWallpapers.filter(w => w.category === "Abstract"),
  // Add more collections...
}

// Helper to get wallpapers by category
export const getWallpapersByCategory = (category: string) => {
  return allWallpapers.filter(w => w.category === category)
}
