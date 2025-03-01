"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "./ui/button"

interface BentoGridProps {
  onPreview: (wallpaper: any) => void
}

export default function BentoGrid({ onPreview }: BentoGridProps) {
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

      {/* New Simplified Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-7xl mx-auto">
        {/* Featured large card */}
        <motion.div 
          className="md:col-span-2 md:row-span-2 relative overflow-hidden group aspect-square md:aspect-auto md:h-[600px]"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src="https://ik.imagekit.io/starknight/tr:w-800/abstract1.jpg"
            alt="Featured Collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Featured Collection</h3>
            <p className="text-white/80">Our best curated wallpapers</p>
          </div>
        </motion.div>

        {/* Regular cards */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            className="relative overflow-hidden group aspect-square"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={`https://ik.imagekit.io/starknight/tr:w-400/nature${i}.jpg`}
              alt={`Collection ${i}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-bold">Collection {i}</h3>
              <p className="text-sm text-white/80">Nature & Landscapes</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}