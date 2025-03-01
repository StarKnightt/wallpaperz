"use client"
import { motion } from "framer-motion"
import { Image } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            About Wallpaperz
          </h1>
          <p className="text-xl text-center text-muted-foreground max-w-2xl mx-auto">
            Your premier destination for stunning wallpapers, crafted with passion and delivered with excellence.
          </p>
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert space-y-12">
          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Image className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              At Wallpaperz, we're building a simple and beautiful platform for wallpaper enthusiasts. 
              Our goal is to provide a curated collection of high-quality wallpapers that enhance your 
              digital spaces. Whether you're looking for nature scenes, abstract art, or minimal designs, 
              we're here to help you find the perfect backdrop for your screen.
            </p>
          </motion.section>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Carefully curated wallpapers",
                "Simple, clean interface",
                "Fast, easy downloads",
                "Regular new additions",
                "Multiple resolution options",
                "Free for personal use"
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
