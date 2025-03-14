"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft, Frown } from "lucide-react"

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
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
          className="mb-6 flex justify-center"
          variants={itemVariants}
        >
          <div className="relative">
            <div className="text-[120px] md:text-[180px] font-bold text-primary/10">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Frown className="w-20 h-20 md:w-32 md:h-32 text-primary/50" />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-5xl font-bold mb-4"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-xl text-muted-foreground mb-8"
          variants={itemVariants}
        >
          Oops! The page you're looking for seems to have wandered off.
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