"use client"
import { motion } from "framer-motion"
import { Users, Image, Download, Heart } from "lucide-react"

const stats = [
  { icon: Users, label: "Active Users", value: "100+" },
  { icon: Image, label: "Wallpapers", value: "1K+" },
  { icon: Download, label: "Downloads", value: "500+" },
  { icon: Heart, label: "Favorites", value: "200+" },
]

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

      {/* Stats Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center space-y-2"
            >
              <stat.icon className="w-8 h-8 mx-auto text-primary" />
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
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
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              To create a simple and beautiful platform for wallpaper enthusiasts to discover and 
              share high-quality wallpapers. We're just starting out, but we're committed to 
              growing our collection and building a community around beautiful desktop art.
            </p>
          </motion.section>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Carefully selected wallpapers",
                "Simple, clean interface",
                "Easy download process",
                "Growing collection",
                "Community features coming soon",
                "Free for personal use"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-primary/5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
