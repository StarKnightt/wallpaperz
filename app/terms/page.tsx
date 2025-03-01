"use client"
import { motion } from "framer-motion"
import { ScrollText, Shield, AlertCircle, Scale } from "lucide-react"

export default function TermsPage() {
  const sections = [
    {
      icon: ScrollText,
      title: "Terms of Service",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Welcome to Wallpaperz. By accessing or using our service, you agree to comply 
            with and be bound by the following terms and conditions:
          </p>
          <div className="space-y-3">
            <p>1. All wallpapers provided through our platform are intended for personal use only.</p>
            <p>2. Any commercial usage of our wallpapers requires explicit written permission from the respective rights holders.</p>
            <p>3. Redistribution of wallpapers from our platform is strictly prohibited without prior authorization.</p>
            <p>4. Users must maintain and respect all attribution and credit to original artists where provided.</p>
          </div>
        </div>
      )
    },
    {
      icon: Shield,
      title: "Usage Rights",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Under these terms, you are explicitly permitted to:</p>
          <div className="space-y-3">
            <p>1. Download and use wallpapers for personal desktop and mobile device customization.</p>
            <p>2. Share direct links to wallpapers on our platform through social media or personal websites.</p>
            <p>3. Create personal modifications of wallpapers for non-commercial use.</p>
            <p>4. Save wallpapers to your personal collection within our platform.</p>
          </div>
        </div>
      )
    },
    {
      icon: AlertCircle,
      title: "Usage Limitations",
      content: (
        <div className="space-y-4">
          <p className="text-lg">The following activities are strictly prohibited:</p>
          <div className="space-y-3">
            <p>1. Commercial distribution or sale of wallpapers from our platform.</p>
            <p>2. Claiming ownership or copyright of wallpapers provided through our service.</p>
            <p>3. Removing, altering, or obscuring any watermarks, attributions, or copyright notices.</p>
            <p>4. Using wallpapers for NFT creation, AI training, or other automated data collection.</p>
            <p>5. Incorporating wallpapers into commercial products or services without authorization.</p>
          </div>
        </div>
      )
    },
    {
      icon: Scale,
      title: "Legal Notice",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Wallpaperz maintains the right to modify, update, or amend these terms of service 
            at any time without prior notice. Continued use of our platform following any 
            modifications constitutes your acceptance of the updated terms.
          </p>
          <p>
            We reserve the right to terminate or restrict access to our service for any users 
            found in violation of these terms. All decisions regarding term violations are 
            final and at the discretion of Wallpaperz administration.
          </p>
        </div>
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