"use client"
import { motion } from "framer-motion"
import Image from "next/image"

interface BentoGridProps {
  onPreview: (wallpaper: any) => void
  items?: BentoItem[]
}

interface BentoItem {
  id: number
  type: "content" | "ad"
  span: "single" | "double" | "featured"
  image?: string
  title?: string
  description?: string
}

export default function BentoGrid({ onPreview, items: propItems }: BentoGridProps) {
  // Use provided items or default to the predefined set
  const items = propItems || [
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
      type: "content",
      span: "single",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract2.jpg",
      title: "Minimal",
      description: "Clean and simple designs",
    },
    {
      id: 3,
      type: "content",
      span: "double",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract3.jpg",
      title: "Landscapes",
      description: "Beautiful scenery from around the world",
    },
    {
      id: 4,
      type: "content",
      span: "single",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract4.jpg",
      title: "Abstract",
      description: "Colorful abstract patterns",
    },
    {
      id: 5,
      type: "content",
      span: "double",
      image: "https://ik.imagekit.io/starknight/tr:w-800/abstract5.jpg",
      title: "Dark Theme",
      description: "Perfect for OLED screens",
    },
  ]

  return (
    <div className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-8"
        >
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
          <h2 className="text-center text-base font-semibold text-primary">Discover</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Featured Collections
          </p>
        </motion.div>

        {/* Modern bento grid layout inspired by Tailwind's design */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-12 lg:grid-rows-6"
        >
          {items.map((item, index) => {
            // Determine grid placement based on item span and position
            let gridClass = "";
            
            if (item.span === "featured") {
              // Featured items take 2 rows and 6 columns
              gridClass = "lg:col-span-6 lg:row-span-4";
            } else if (item.span === "double") {
              // Double items take 6 columns and 1 row
              gridClass = "lg:col-span-6 lg:row-span-2";
            } else {
              // Single items take 3 columns and 1 row
              gridClass = "lg:col-span-3 lg:row-span-2";
            }
            
            // Special positioning for certain indices
            if (index === 0) {
              // First featured item goes on the left
              gridClass += " lg:col-start-1 lg:row-start-1";
            } else if (index === 1 && item.span === "single") {
              // First single item goes top right
              gridClass += " lg:col-start-7 lg:row-start-1";
            } else if (index === 2 && item.span === "single") {
              // Second single item goes top right corner
              gridClass += " lg:col-start-10 lg:row-start-1";
            }
            
            return (
              <motion.div
                key={item.id}
                className={`relative ${gridClass}`}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onClick={() => onPreview(item)}
              >
                <div className="absolute inset-px rounded-2xl bg-white dark:bg-gray-800"></div>
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl">
                  <div className="px-6 pt-6 pb-3">
                    <h3 className="mt-2 text-lg font-medium tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm/6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="relative flex-grow">
                    <div className={`absolute inset-0 ${item.span === "featured" ? "pt-[50%]" : "pt-[40%]"}`}>
                      <div className="absolute inset-0 overflow-hidden rounded-b-xl">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title || "Wallpaper"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                          priority={item.span === "featured" || index < 3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-2xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10"></div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}