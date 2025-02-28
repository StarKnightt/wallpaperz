"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Download, Eye } from "lucide-react"
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

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-7xl mx-auto h-full">
        {/* Large featured card */}
        <motion.div 
          className="md:col-span-2 relative rounded-xl overflow-hidden group h-[500px] md:h-[600px]"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src="https://ik.imagekit.io/starknight/tr:w-800/abstract1.jpg"
            alt="Featured wallpaper"
            width={1920}
            height={1080}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
            <h3 className="text-2xl font-bold mb-2">Abstract Collection</h3>
            <p className="text-white/80 mb-4">Explore our curated abstract wallpapers</p>
            <div className="flex gap-2">
              <Button variant="secondary" className="bg-white/10 backdrop-blur-sm">
                View All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Smaller cards */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:h-[600px]">
          {[1, 2].map((i) => (
            <motion.div 
              key={i}
              className="relative rounded-xl overflow-hidden group h-[240px] md:h-[294px]"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={`https://ik.imagekit.io/starknight/tr:w-400/nature${i}.jpg`}
                alt={`Collection ${i}`}
                width={960}
                height={540}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                <h3 className="text-lg font-bold mb-1">Nature Collection {i}</h3>
                <p className="text-white/80 text-sm">Beautiful landscapes</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom row cards */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3 h-[240px] md:h-[294px]">
          {[3, 4, 5].map((i) => (
            <motion.div 
              key={i}
              className="relative rounded-xl overflow-hidden group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={`https://ik.imagekit.io/starknight/tr:w-400/nature${i}.jpg`}
                alt={`Collection ${i}`}
                width={960}
                height={540}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                <h3 className="text-lg font-bold mb-1">Nature Collection {i}</h3>
                <p className="text-white/80 text-sm">Beautiful landscapes</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}