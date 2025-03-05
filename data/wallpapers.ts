import { Wallpaper, WallpaperCollection } from "@/types/wallpaper"

// Store only the path part, not the full URL
export const allWallpapers: Wallpaper[] = [
  {
    id: "1",
    title: "Girl-Thinking about it",
    imageUrl: "Anime/6.jpg", // Remove the base URL part
    category: "Anime",
    description: "A contemplative anime girl in a serene setting, perfect for those who love emotional and thoughtful anime artwork. The detailed art style captures the essence of modern Japanese animation with beautiful color composition.",
    source: "pixabay"
  },
  {
    id: "2",
    title: "Sunset in a different way",
    imageUrl: "Art/1.jpg", // Remove the base URL part
    category: "Abstract",
    description: "A stunning digital art interpretation of a sunset featuring vibrant colors and abstract elements. This modern artistic wallpaper combines warm sunset hues with contemporary design elements, ideal for creative workspaces.",
    source: "pexels"
  },
  {
    id: "3",
    title: "4k Flower wallpaper",
    imageUrl: "Art/5.jpg", // Remove the base URL part
    category: "Abstract",
    description: "High-resolution 4K abstract flower artwork with intricate details and mesmerizing patterns. The vibrant colors and unique artistic style make it perfect for nature lovers and modern art enthusiasts.",
    source: "pexels"
  },
  {
    id: "5",
    title: "Finally Fantasty Rebirth",
    imageUrl: "Anime/3.jpeg", // Remove the base URL part
    category: "Anime",
    description: "Epic fantasy-themed anime artwork inspired by popular JRPG aesthetics. Features dramatic lighting, detailed character design, and magical elements that capture the essence of Japanese gaming and animation culture.",
    source: "pexels"
  },
  {
    id: "6",
    title: "Futuristic Windows wallpaper",
    imageUrl: "Art/7.png", // Remove the base URL part
    category: "Abstract",
    description: "Ultra-modern abstract wallpaper with a futuristic tech aesthetic. Perfect for desktop customization, featuring sleek geometric patterns and a cutting-edge design that complements any modern operating system.",
    source: "pexels"
  },
  {
    id: "7",
    title: "God with a programmer",
    imageUrl: "Art/8_JYkc21aIQ", // Remove the base URL part
    category: "Abstract",
    description: "Artistic representation of divine inspiration in programming, featuring symbolic elements of technology and spirituality. A unique perspective on the creative process of coding, perfect for developers and tech enthusiasts.",
    source: "pexels"
  },
  {
    id: "8",
    title: "A boy drinking smoothie",
    imageUrl: "Anime/2.jpeg", // Remove the base URL part
    category: "Anime",
    description: "Charming slice-of-life anime scene featuring a young boy enjoying a refreshing smoothie with his pet. The artwork captures the casual, peaceful moments that make anime storytelling special, with attention to detail in expressions and environment.",
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
    id: "18",
    title: "A girl walking on the road alone",
    imageUrl: "Anime/18.jpg",
    category: "Anime",
    description: "Atmospheric anime scene of a solitary girl walking through a forested path. The artwork masterfully captures the mood of peaceful solitude, with detailed environmental elements and subtle lighting effects that create a story-like experience.",
    source: "pexels"
  },
  {
    id: "19",
    title: "A van is going on a mountain",
    imageUrl: "Anime/22.jpg",
    category: "Anime",
    description: "Adventure-themed anime artwork featuring a classic van journeying through mountain landscapes. This nostalgic scene captures the spirit of road trips and exploration, with careful attention to vehicle details and scenic beauty.",
    source: "pexels"
  },
  {
    id: "20",
    title: "Beautiful scenery of a mountain",
    imageUrl: "Anime/21.jpg",
    category: "Anime",
    description: "Stunning anime interpretation of a mountain landscape with exceptional detail and atmosphere. The artwork combines traditional landscape painting techniques with modern anime styling, creating an immersive visual experience.",
    source: "pexels"
  },
  {
    id: "21",
    title: "A girl sitting with her pet",
    imageUrl: "Anime/27.jpg",
    category: "Anime",
    description: "Heartwarming anime scene depicting the special bond between a girl and her pet. The artwork emphasizes emotional connection through expressive character design and warm color palette, perfect for animal lovers and slice-of-life anime fans.",
    source: "pexels"
  },
  {
    id: "22",
    title: "A Couple",
    imageUrl: "Anime/23.jpg",
    category: "Anime",
    description: "Romantic anime artwork featuring a couple in a tender moment. The illustration captures the essence of young love through delicate character expressions and atmospheric lighting, appealing to fans of romance anime and emotional storytelling.",
    source: "pexels"
  },
  {
    id: "23",
    title: "A girl is looking",
    imageUrl: "Anime/28.jpg",
    category: "Anime",
    description: "Dreamy anime portrait of a girl gazing thoughtfully at the sky. This artwork emphasizes emotional depth through careful attention to facial expressions and environmental details, perfect for fans of contemplative anime art.",
    source: "pexels"
  },
  {
    id: "24",
    title: "A Samurai is looking",
    imageUrl: "Anime/24.jpg",
    category: "Anime",
    description: "Dramatic portrait of a mysterious samurai warrior in traditional Japanese style. The artwork combines historical accuracy with modern anime aesthetics, featuring intense atmosphere and detailed costume design.",
    source: "pexels"
  },
  {
    id: "25",
    title: "An Anime girl on a festival",
    imageUrl: "Anime/25.jpg",
    category: "Anime",
    description: "Vibrant anime scene capturing the joy and excitement of a traditional Japanese festival. The artwork features detailed yukata designs, festival decorations, and atmospheric lighting that brings the celebration to life.",
    source: "pexels"
  },
  {
    id: "26",
    title: "An girl is looking at the moon",
    imageUrl: "Anime/20.jpg",
    category: "Anime",
    description: "Ethereal nighttime scene of an anime girl contemplating the moon. This atmospheric artwork combines celestial beauty with emotional storytelling, featuring subtle moonlight effects and expressive character design.",
    source: "pexels"
  },
  {
    id: "27",
    title: "Beautiful scenery of mountains",
    imageUrl: "Anime/29.jpg", // Remove the base URL part
    category: "Anime",
    description: "Breathtaking anime-style landscape featuring majestic mountains with incredible detail and atmospheric effects. The artistic interpretation combines traditional landscape elements with modern anime aesthetics, perfect for nature and animation enthusiasts.",
    source: "pexels"
  },
  {
    id: "28",
    title: "An beautiful painting of two illusion",
    imageUrl: "Anime/26.jpg", // Remove the base URL part
    category: "Anime",
    description: "Surreal double illusion artwork that challenges perception, featuring intricate details and masterful composition. This thought-provoking piece combines traditional artistic elements with modern anime-style illustration techniques.",
    source: "pixabay"
  },
  {
    id: "29",
    title: "Celebrating Birthday party",
    imageUrl: "Anime/30.jpg", // Remove the base URL part
    category: "Anime",
    description: "Joyful anime scene depicting a vibrant birthday celebration with detailed character expressions and festive atmosphere. The artwork captures the excitement and warmth of special occasions in classic anime style.",
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
