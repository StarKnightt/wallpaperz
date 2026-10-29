"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"]
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 15,
    restDelta: 0.001,
  })

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.015, 0.035, 0.965, 0.985, 1],
    [0, 0.5, 1, 1, 0.5, 0]
  )

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      if (scrolled !== isVisible) {
        setIsVisible(scrolled)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-[0%] z-[9999]"
      style={{ opacity }}
    >
      <motion.div className="absolute inset-0 origin-[0%] bg-brand" style={{ scaleX }} />
    </motion.div>
  )
}
