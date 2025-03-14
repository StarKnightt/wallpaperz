"use client"
import { motion } from "framer-motion"
import { ImageIcon, Coffee, Globe, Github, Heart, Code, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
              <ImageIcon className="w-8 h-8 text-primary" />
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
          
          {/* Let's Build Together Section - Replaced the Meet the Creator section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold mb-6">Let's Build Together</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-lg text-muted-foreground mb-4">
                  Want to support this project? Wallpaperz is an open-source initiative that thrives 
                  on community contributions and support. Together, we can create an amazing platform 
                  for wallpaper enthusiasts everywhere.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Whether you're a developer looking to contribute code, a designer with an eye for aesthetics, 
                  or simply a user who enjoys the platform, there are many ways to help this project grow!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    {
                      icon: Heart,
                      title: "Support",
                      description: "Buy me a coffee to help keep the servers running and development active."
                    },
                    {
                      icon: Code,
                      title: "Contribute",
                      description: "Submit pull requests, report bugs, or suggest new features on GitHub."
                    },
                    {
                      icon: Users,
                      title: "Share",
                      description: "Spread the word and help grow our community of wallpaper enthusiasts."
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 text-center">
                      <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href="https://prasen.dev" target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      Portfolio
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href="https://github.com/StarKnightt/wallpaperz" target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Link>
                  </Button>
                  <Button asChild variant="default" size="sm" className="gap-2">
                    <Link href="https://buymeacoffee.com/prasen" target="_blank" rel="noopener noreferrer">
                      <Coffee className="h-4 w-4" />
                      Buy Me a Coffee
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
