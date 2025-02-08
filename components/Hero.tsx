import { Button } from "@/components/ui/button"
import { Download, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import { useState, useEffect } from 'react'

const words = ["Perfect", "Best", "exact", "Pretty", "Cute"]

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
      <div className="absolute inset-0 bg-grid-white/10 bg-grid animate-grid-fade" />
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 relative animate-gradient-x">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text content */}
            <motion.div 
              className="text-white space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300 animate-text-shimmer">
                Find Your{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[wordIndex]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="inline-block text-yellow-400"
                  >
                    {words[wordIndex]}
                  </motion.span>
                </AnimatePresence>
                {" "}Wallpaper
              </h1>

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

              <motion.div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 pt-4">
                <div>
                  <p className="text-3xl font-bold">1000+</p>
                  <p className="text-sm opacity-75">Wallpapers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50k+</p>
                  <p className="text-sm opacity-75">Downloads</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">100+</p>
                  <p className="text-sm opacity-75">Categories</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Image grid - maintaining original layout */}
            <motion.div 
              className="hidden md:block relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <motion.div 
                    className="rounded-lg overflow-hidden shadow-lg transform translate-y-8"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Image
                      src="https://ik.imagekit.io/starknight/Anime/2.jpeg?updatedAt=1738950341390"
                      alt="Sample wallpaper"
                      width={500}
                      height={300}
                      className="w-full h-40 xl:h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </motion.div>
                  <motion.div 
                    className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Image
                      src="https://ik.imagekit.io/starknight/Anime/3.jpeg?updatedAt=1738950341010"
                      alt="Sample wallpaper"
                      width={500}
                      height={300}
                      className="w-full h-40 xl:h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </motion.div>
                </div>
                <div className="space-y-4 transform translate-y-16">
                  <motion.div 
                    className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Image
                      src="https://ik.imagekit.io/starknight/Art/1.jpg?updatedAt=1738950598212"
                      alt="Sample wallpaper"
                      width={500}
                      height={300}
                      className="w-full h-40 xl:h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </motion.div>
                  <motion.div 
                    className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Image
                      src="https://ik.imagekit.io/starknight/Art/5.jpg?updatedAt=1738950784247"
                      alt="Sample wallpaper"
                      width={500}
                      height={300}
                      className="w-full h-40 xl:h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
