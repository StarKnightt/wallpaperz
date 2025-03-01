"use client"
import { motion } from "framer-motion"
import { Shield, Lock, FileText, Mail } from "lucide-react"
import { Container } from "@/components/ui/container"

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Data Collection & Usage",
      content: (
        <div className="space-y-4">
          <p className="text-lg">We are committed to protecting your privacy and handling your data with transparency:</p>
          <div className="space-y-3">
            <p>1. Account Information Collection</p>
            <ul className="list-none pl-6 space-y-2">
              <li>• Email address (for registered users only)</li>
              <li>• Display name (optional)</li>
              <li>• Profile picture (optional)</li>
            </ul>

            <p>2. Usage Information</p>
            <ul className="list-none pl-6 space-y-2">
              <li>• Wallpaper download history</li>
              <li>• Favorite wallpapers</li>
              <li>• Search queries</li>
              <li>• Device type and browser information</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: Lock,
      title: "Data Security",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Your data security is our priority:</p>
          <div className="space-y-3">
            <p>1. Data Protection Measures</p>
            <ul className="list-none pl-6 space-y-2">
              <li>• Industry-standard SSL encryption</li>
              <li>• Secure cloud storage</li>
              <li>• Regular security audits</li>
            </ul>

            <p>2. Third-Party Services</p>
            <ul className="list-none pl-6 space-y-2">
              <li>• Clerk.com for authentication</li>
              <li>• Vercel Analytics for usage statistics</li>
              <li>• Microsoft Clarity for UX improvement</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: FileText,
      title: "Cookie Policy",
      content: (
        <div className="space-y-4">
          <p className="text-lg">We use cookies to enhance your experience:</p>
          <div className="space-y-3">
            <p>1. Essential Cookies</p>
            <ul className="list-none pl-6 space-y-2">
              <li>• Authentication status</li>
              <li>• Session management</li>
              <li>• Security features</li>
            </ul>

            <p>2. Analytics Cookies</p>
            <ul className="list-none pl-6 space-y-2">
              <li>• Usage patterns</li>
              <li>• Performance monitoring</li>
              <li>• Feature optimization</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: Mail,
      title: "Your Rights & Contact",
      content: (
        <div className="space-y-4">
          <p className="text-lg">You have the right to:</p>
          <div className="space-y-3">
            <p>1. Access and Control</p>
            <ul className="list-none pl-6 space-y-2">
              <li>• Request your data</li>
              <li>• Delete your account</li>
              <li>• Opt-out of analytics</li>
            </ul>

            <p>2. Contact Information</p>
            <ul className="list-none pl-6 space-y-2">
              <li>• Email: prasen.nayak@hotmail.com</li>
              <li>• Response time: Within 48 hours</li>
            </ul>
          </div>
        </div>
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