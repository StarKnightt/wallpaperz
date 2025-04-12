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
  span: "single" | "double"
  image?: string
  title?: string
  description?: string
}
  
export default function BentoGrid({ onPreview, items: propItems }: BentoGridProps) {
  // Use provided items directly, no default items needed
  const items = propItems || []

  return (
    <section className="py-8 md:py-12 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3 max-w-7xl mx-auto">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`relative group cursor-pointer
              ${item.span === "double" ? "col-span-4" : "col-span-2"}
            `}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => onPreview(item)}
          >
            <div className="relative w-full rounded-xl overflow-hidden">
              <div className="relative pt-[56.25%]">
                <Image
                  src={item.image! || "/placeholder.svg"}
                  alt={item.title!}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover absolute inset-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg line-clamp-1">{item.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm line-clamp-1 md:line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}