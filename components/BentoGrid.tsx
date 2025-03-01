"use client"
import { motion } from "framer-motion"
import Image from "next/image"

interface BentoGridProps {
  onPreview: (wallpaper: any) => void
}

interface BentoItem {
  id: number
  type: 'content' | 'ad'
  span: 'single' | 'double' | 'featured'
  image?: string
  title?: string
  description?: string
}

export default function BentoGrid({ onPreview }: BentoGridProps) {
  // Define grid items with ad slots
  const items: BentoItem[] = [
    {
      id: 1,
      type: 'content',
      span: 'featured',
      image: 'https://ik.imagekit.io/starknight/tr:w-800/abstract1.jpg',
      title: 'Featured Collection',
      description: 'Our best curated wallpapers'
    },
    { id: 2, type: 'ad', span: 'single' }, // Ad slot 1
    // ...more items with mix of content and ads
  ]

  return (
    <section className="py-12 px-4">
      {/* Lamp effect header */}
      <div className="relative">
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <h2 className="text-3xl font-bold text-center mb-12 relative">
          Featured Collections
        </h2>
      </div>

      {/* Masonry Grid with Ad Slots */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-3 max-w-7xl mx-auto">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`relative overflow-hidden
              ${item.span === 'featured' ? 'md:col-span-2 md:row-span-2' : ''}
              ${item.span === 'double' ? 'md:col-span-2' : ''}
              ${item.type === 'ad' ? 'bg-muted/30' : ''}
            `}
            whileHover={item.type === 'content' ? { scale: 1.01 } : undefined}
            transition={{ duration: 0.2 }}
          >
            {item.type === 'content' ? (
              <>
                <Image
                  src={item.image!}
                  alt={item.title!}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.description}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Ad Space
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}