import { Button } from "@/components/ui/button"
import { Download, Image as ImageIcon, ArrowDown, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import ComingSoonModal from "./ComingSoonModal"
import Link from 'next/link'

const words = ["Perfect", "Best", "Exact", "Pretty", "Cute"]

// New animation variants
const imageVariants = {
  hover: {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.3,
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

const buttonVariants = {
  rest: { 
    scale: 1,
    backgroundColor: "rgb(255, 255, 255)",
  },
  hover: { 
    scale: 1.05,
    backgroundColor: "rgb(240, 240, 240)",
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const particleCount = 8; // Was 15 before
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState("")

  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const [particles, setParticles] = useState<Array<{
    width: number;
    height: number;
    left: number;
    top: number;
  }>>([])

  // Use useCallback for stable particle positions
  const generateParticles = useCallback(() => {
    return Array(particleCount).fill(0).map(() => ({
      width: Math.random() * 3 + 2,
      height: Math.random() * 3 + 2,
      left: Math.floor(Math.random() * 100), // Floor to avoid hydration mismatch
      top: Math.floor(Math.random() * 100),  // Floor to avoid hydration mismatch
    }))
  }, [particleCount])

  useEffect(() => {
    setParticles(generateParticles())
  }, [generateParticles])

  const scrollToWallpapers = () => {
    const wallpapersSection = document.getElementById('wallpapers-section')
    wallpapersSection?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleComingSoonClick = (feature: string) => {
    setComingSoonFeature(feature)
    setShowComingSoon(true)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex(prev => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Animated Background Image with zoom effect */}
      <div className="absolute inset-0 bg-black">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ 
            scale: [1.1, 1.15, 1.1],
            opacity: [0.7, 0.8, 0.7]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          <Image
            src="/hero.webp"
            alt="Hero background"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center will-change-transform"
            style={{ 
              transform: 'translate3d(0, 0, 0)',
              imageRendering: '-webkit-optimize-contrast',
              backfaceVisibility: 'hidden'
            }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR"
          />
        </motion.div>

        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50"
          initial={{ opacity: 0.5 }}
          animate={{ 
            opacity: [0.5, 0.6, 0.5],
            background: [
              'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.25), rgba(0,0,0,0.5))',
              'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
              'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.25), rgba(0,0,0,0.5))'
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ mixBlendMode: 'overlay' }}
        />

        {/* Optional floating light particles */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0
              }}
              animate={{ 
                y: ['-20%', '-80%'],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative"> {/* Removed gradient background */}
        <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 relative"> {/* Adjusted padding */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"> {/* Adjusted gap */}
            {/* Text content with enhanced animations */}
            <motion.div 
              className="text-white space-y-4 sm:space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight"
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

              <motion.p className="text-sm sm:text-base lg:text-xl opacity-90 max-w-xl">
                Discover thousands of stunning wallpapers for your desktop and mobile devices. 
                Free downloads, high quality, and new additions daily.
              </motion.p>

              {/* Responsive benefit pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                {[
                  '✨ 4K',
                  '🚀 Fast',
                  '🎨 Custom',
                  '🆓 Free'
                ].map((benefit) => (
                  <span key={benefit} 
                    className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs sm:text-sm whitespace-nowrap">
                    {benefit}
                  </span>
                ))}
              </div>

              {/* Responsive category shortcuts */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                {['Nature', 'Abstract', 'Minimal', 'Gaming'].map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={() => scrollToWallpapers()}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  onHoverStart={() => setIsButtonHovered(true)}
                  onHoverEnd={() => setIsButtonHovered(false)}
                >
                  <Button 
                    size="lg"
                    onClick={scrollToWallpapers}
                    className="relative overflow-hidden px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl group border-0"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: '-100%', opacity: 0 }}
                      animate={{ 
                        x: isButtonHovered ? '100%' : '-100%',
                        opacity: isButtonHovered ? 0.5 : 0
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    <motion.div className="relative flex items-center gap-2">
                      <motion.div
                        animate={{ 
                          y: isButtonHovered ? [0, -4, 0] : 0
                        }}
                        transition={{ 
                          duration: 0.6,
                          repeat: isButtonHovered ? Infinity : 0,
                          repeatType: "reverse"
                        }}
                        className="relative"
                      >
                        <ArrowDown className="w-5 h-5" strokeWidth={2} />
                      </motion.div>
                      <span className="relative">
                        Explore Wallpapers
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-[2px] bg-white/50"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ 
                            scaleX: isButtonHovered ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </span>
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Enhanced stats section */}
              <motion.div 
                className="grid grid-cols-2 sm:flex sm:gap-8 gap-3 pt-4"
                variants={containerVariants}
              >
                {[
                  { count: "28+", label: "Wallpapers" },
                  { count: "100+", label: "Downloads" },
                  { count: "3+", label: "Categories" }
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
              className="hidden sm:block relative"
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
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        feature={comingSoonFeature}
      />
    </section>
  )
}
