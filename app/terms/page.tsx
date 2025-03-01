
"use client"
import { motion } from "framer-motion"
import { ScrollText, Shield, AlertCircle, Scale } from "lucide-react"

export default function TermsPage() {
  const sections = [
    {
      icon: ScrollText,
      title: "Terms of Service",
      content: (
        <>
          <p>By using Wallpaperz, you agree to these terms:</p>
          <ul>
            <li>All wallpapers are for personal use only</li>
            <li>Commercial use requires explicit permission</li>
            <li>Do not redistribute our wallpapers</li>
            <li>Credit original artists where applicable</li>
          </ul>
        </>
      )
    },
    {
      icon: Shield,
      title: "Usage Rights",
      content: (
        <>
          <p>You are permitted to:</p>
          <ul>
            <li>Download wallpapers for personal desktop/mobile use</li>
            <li>Share links to our wallpapers</li>
            <li>Create derivative works for personal use</li>
          </ul>
        </>
      )
    },
    {
      icon: AlertCircle,
      title: "Limitations",
      content: (
        <>
          <p>You are not permitted to:</p>
          <ul>
            <li>Sell or redistribute our wallpapers</li>
            <li>Claim ownership of the wallpapers</li>
            <li>Remove watermarks or attribution</li>
            <li>Use wallpapers for NFTs or AI training</li>
          </ul>
        </>
      )
    },
    {
      icon: Scale,
      title: "Legal Notice",
      content: (
        <p>
          Wallpaperz reserves the right to modify these terms at any time. 
          Continued use of the service implies acceptance of updated terms.
        </p>
      )
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Terms of Service
          </h1>
          <p className="text-xl text-center text-muted-foreground max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>

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