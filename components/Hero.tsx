import { Button } from "@/components/ui/button"
import { Download, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import { useState, useEffect } from 'react'

const words = ["Perfect", "Best", "Exact", "Pretty", "Cute"]

// New animation variants
const imageVariants = {
  hover: {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex(prev => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Background with both pulse and particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 animate-pulse-glow" />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 relative animate-gradient-x">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text content with enhanced animations */}
            <motion.div 
              className="text-white space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-text-shimmer">
                  Find Your{" "}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[wordIndex]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="inline-block text-yellow-400 relative"
                  >
                    {words[wordIndex]}
                    {/* Add a glowing effect */}
                    <span className="absolute -inset-1 bg-yellow-400/20 blur-lg" />
                  </motion.span>
                </AnimatePresence>
                {" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-text-shimmer">
                  Wallpaper
                </span>
              </motion.h1>

              <motion.p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-xl">
                Discover thousands of stunning wallpapers for your desktop and mobile devices. 
                Free downloads, high quality, and new additions daily.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="gap-2">
                  <ImageIcon size={20} />
                  Browse Collection
                </Button>
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20">
                  <Download size={20} />
                  Popular Downloads
                </Button>
              </motion.div>

              {/* Enhanced stats section */}
              <motion.div 
                className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 pt-4"
                variants={containerVariants}
              >
                {[
                  { count: "1000+", label: "Wallpapers" },
                  { count: "50k+", label: "Downloads" },
                  { count: "100+", label: "Categories" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-white/5 rounded-lg blur-lg group-hover:bg-white/10 transition-all duration-300" />
                    <div className="relative">
                      <p className="text-3xl font-bold">{stat.count}</p>
                      <p className="text-sm opacity-75">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image grid with enhanced animations */}
            <motion.div 
              className="hidden md:block relative"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {/* First two images */}
                  {[
                    "https://ik.imagekit.io/starknight/Anime/2.jpeg?updatedAt=1738950341390",
                    "https://ik.imagekit.io/starknight/Anime/3.jpeg?updatedAt=1738950341010"
                  ].map((src, index) => (
                    <motion.div
                      key={index}
                      className="rounded-lg overflow-hidden shadow-lg relative group"
                      variants={imageVariants}
                      whileHover="hover"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Image
                        src={src}
                        alt="Wallpaper preview"
                        width={500}
                        height={300}
                        className="w-full h-40 xl:h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Second column - similar structure */}
                <div className="space-y-4 transform translate-y-16">
                  {[
                    "https://ik.imagekit.io/starknight/Art/1.jpg?updatedAt=1738950598212",
                    "https://ik.imagekit.io/starknight/Art/5.jpg?updatedAt=1738950784247"
                  ].map((src, index) => (
                    <motion.div
                      key={index}
                      className="rounded-lg overflow-hidden shadow-lg relative group"
                      variants={imageVariants}
                      whileHover="hover"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Image
                        src={src}
                        alt="Wallpaper preview"
                        width={500}
                        height={300}
                        className="w-full h-40 xl:h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
