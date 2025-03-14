"use client"

import { motion } from "framer-motion"
import { Sparkles, Image as ImageIcon, Rocket, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GalleryPage() {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 mb-16">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-60" />
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-xl opacity-30" />
            <div className="relative bg-background/80 backdrop-blur-sm p-6 rounded-full border">
              <ImageIcon className="w-16 h-16 text-primary mx-auto" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Gallery Coming Soon
        </motion.h1>
        
        <motion.p 
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          We're working hard to curate a beautiful collection of wallpapers for you. 
          Check back soon to explore our gallery!
        </motion.p>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {[
            {
              icon: Rocket,
              title: "Launching Soon",
              description: "Our gallery is being prepared for launch with hundreds of high-quality wallpapers."
            },
            {
              icon: Calendar,
              title: "Coming This Month",
              description: "We're working to bring you the gallery experience very soon."
            },
            {
              icon: ImageIcon,
              title: "Try AI Generate",
              description: "While you wait, try our AI generation feature to create custom wallpapers."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="bg-background/50 backdrop-blur-sm border rounded-xl p-6 flex flex-col items-center text-center"
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button asChild size="lg">
            <Link href="/ai-generate">
              Try AI Generate Instead
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
} 