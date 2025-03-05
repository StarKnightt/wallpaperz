"use client"
import { motion } from "framer-motion"
import Image from "next/image"

interface BentoGridProps {
  onPreview: (wallpaper: any) => void
}

interface BentoItem {
  id: number
  type: "content" | "ad"
  span: "single" | "double" | "featured"
  image?: string
  title?: string
  description?: string
}

export default function BentoGrid({ onPreview }: BentoGridProps) {
  const items: BentoItem[] = [
    {
      id: 1,
      type: "content",
      span: "featured",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract1.jpg",
      title: "Featured Collection",
      description: "Our best curated wallpapers",
    },
    {
      id: 2,
      type: "ad",
      span: "single",
    },
    {
      id: 3,
      type: "content",
      span: "single",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract2.jpg",
      title: "Minimal",
      description: "Clean and simple designs",
    },
    {
      id: 4,
      type: "content",
      span: "double",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract3.jpg",
      title: "Landscapes",
      description: "Beautiful scenery from around the world",
    },
    {
      id: 5,
      type: "content",
      span: "single",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract4.jpg",
      title: "Abstract",
      description: "Colorful abstract patterns",
    },
    {
      id: 6,
      type: "ad",
      span: "single",
    },
    {
      id: 7,
      type: "content",
      span: "double",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract5.jpg",
      title: "Dark Theme",
      description: "Perfect for OLED screens",
    },
    {
      id: 8,
      type: "content",
      span: "single",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract6.jpg",
      title: "Vibrant",
      description: "Bold and colorful designs",
    },
  ]

  return (
    <section className="py-8 md:py-12 px-4">
      <div className="relative">
        <motion.div
          className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 w-32 md:w-40 h-32 md:h-40 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 relative">Featured Collections</h2>
      </div>

      {/* Updated grid to maintain aspect ratio */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 max-w-7xl mx-auto">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`relative group cursor-pointer
              ${item.span === "featured" ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2" : ""}
              ${item.span === "double" ? "col-span-2 sm:col-span-2 md:col-span-2" : ""}
              ${item.type === "ad" ? "bg-muted/30" : ""}
            `}
            whileHover={item.type === "content" ? { scale: 1.01 } : undefined}
            transition={{ duration: 0.2 }}
            onClick={() => item.type === "content" && onPreview(item)}
          >
            {item.type === "content" ? (
              <div className="relative w-full rounded-xl overflow-hidden">
                {/* Aspect ratio container */}
                <div className="relative pt-[56.25%]">
                  {" "}
                  {/* 16:9 aspect ratio */}
                  <Image
                    src={item.image! || "/placeholder.svg"}
                    alt={item.title!}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover absolute inset-0"
                    priority={item.span === "featured"}
                    loading={item.span === "featured" ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white">
                    <h3 className="font-bold text-sm sm:text-base md:text-lg line-clamp-1">{item.title}</h3>
                    <p className="text-white/80 text-xs sm:text-sm line-clamp-1 md:line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative pt-[56.25%]">
                {" "}
                {/* Maintain same aspect ratio for ad spaces */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm md:text-base">
                  Ad Space
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

