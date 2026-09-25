"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"
import { PhoneFrame } from "@/components/Devices"

const BARS = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"]

function NoSignalScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <svg viewBox="0 0 70 150" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <g className="glitch-bars">
          {BARS.map((c, i) => (
            <rect key={c} x={i * 10} y="0" width="10" height="100" fill={c} />
          ))}
          {BARS.slice().reverse().map((c, i) => (
            <rect key={`r-${c}`} x={i * 10} y="100" width="10" height="12" fill={i % 2 ? "#111" : c} />
          ))}
          <rect x="0" y="112" width="18" height="38" fill="#00214c" />
          <rect x="18" y="112" width="18" height="38" fill="#fff" />
          <rect x="36" y="112" width="18" height="38" fill="#32006a" />
          <rect x="54" y="112" width="16" height="38" fill="#131313" />
        </g>
        <rect className="glitch-slice" x="0" y="40" width="70" height="9" fill="#c000c0" />
        <rect className="glitch-slice glitch-slice-b" x="0" y="82" width="70" height="5" fill="#00c0c0" />
      </svg>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0_1px,transparent_1px_3px)] motion-safe:animate-scanlines" />
      <div className="absolute inset-x-0 top-[42%] text-center font-mono text-[10px] md:text-xs font-bold tracking-[0.25em] text-white [text-shadow:0_0_6px_#000]">
        NO SIGNAL
      </div>
    </div>
  )
}

export default function NotFound() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      {/* 404 Content */}
      <motion.div 
        className="relative z-10 max-w-2xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <div className="w-32 md:w-40 -rotate-6 motion-safe:animate-device-bob" aria-hidden="true">
            <PhoneFrame>
              <NoSignalScreen />
            </PhoneFrame>
          </div>
        </motion.div>
        
        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-4"
          variants={itemVariants}
        >
          <span className="glitch-text" data-text="404">404</span>
          <span className="block mt-2 text-2xl md:text-3xl">No wallpaper on this screen</span>
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground mb-8"
          variants={itemVariants}
        >
          This page doesn&apos;t exist, or the wallpaper was removed. Head back and pick another one.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/ai-generate">
              <Search className="w-4 h-4" />
              Generate Wallpapers
            </Link>
          </Button>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-muted-foreground"
          variants={itemVariants}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
} 