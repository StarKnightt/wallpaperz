"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll({
    // Smoother scroll tracking
    offset: ["start start", "end end"]
  })
  
  // Enhanced spring animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 40,   
    damping: 15,      
    restDelta: 0.001, 
  })

  // Refined opacity transition
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.015, 0.035, 0.965, 0.985, 1],
    [0, 0.5, 1, 1, 0.5, 0]
  )

  // Enhanced visibility control
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      if (scrolled !== isVisible) {
        setIsVisible(scrolled)
      }
    }

    handleScroll() // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-[0%] z-[9999]"
      style={{ opacity }}
    >
      {/* Primary gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500"
        style={{ scaleX }}
      />

      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0"
        style={{ scaleX }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.5
          }}
        />
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-orange-500/20 blur-[6px] -z-10"
        style={{ scaleX }}
      />
    </motion.div>
  )
} 