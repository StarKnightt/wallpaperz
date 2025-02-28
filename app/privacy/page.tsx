"use client"
import { motion } from "framer-motion"
import { Shield, Lock, FileText, Mail } from "lucide-react"
import { Container } from "@/components/ui/container"

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Image Sources & Copyright",
      content: (
        <>
          <p>
            Wallpaperz provides wallpapers from various sources:
          </p>
          <ul>
            <li>Royalty-free images from platforms like Unsplash, Pexels, and Pixabay</li>
            <li>Original content created by Wallpaperz</li>
            <li>User-submitted content (where applicable)</li>
          </ul>
          <p>
            While we make every effort to ensure all content is free to use, specific images 
            may be subject to their respective licenses. Users should verify the license terms 
            before commercial use.
          </p>
        </>
      )
    },
    {
      icon: Lock,
      title: "User Data & Privacy",
      content: (
        <>
          <p>
            We collect minimal user data necessary for service functionality:
          </p>
          <ul>
            <li>Basic account information (if you choose to register)</li>
            <li>Download history and favorites (for registered users)</li>
            <li>Usage analytics for service improvement</li>
          </ul>
        </>
      )
    },
    {
      icon: FileText,
      title: "Terms of Use",
      content: (
        <>
          <h2>Usage Rights</h2>
          <p>
            All wallpapers are free for personal use. For commercial use, please refer to the 
            original source's license terms, which are linked where available.
          </p>
          <h2>Attributions</h2>
          <p>
            We provide attribution to original sources where possible. If you believe your work 
            has been used without proper attribution or permission, please contact us for prompt resolution.
          </p>
          <h2>Disclaimer</h2>
          <p>
            While we strive to provide high-quality content, we cannot guarantee the copyright 
            status of every image. Users are responsible for verifying usage rights for their 
            specific needs. If you find any content that violates copyright laws, please 
            contact us for immediate removal.
          </p>
        </>
      )
    },
    {
      icon: Mail,
      title: "Contact",
      content: (
        <>
          <p>
            For copyright claims, questions, or concerns, please contact us at:
            <br />
            Email: support@wallpaperz.com
          </p>
        </>
      )
    }
  ]

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
            Privacy Policy
          </h1>
          <p className="text-xl text-center text-muted-foreground max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary/5 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <section.icon className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert">
                {section.content}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}