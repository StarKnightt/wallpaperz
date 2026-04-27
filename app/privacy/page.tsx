"use client"
import { motion } from "framer-motion"
import { Shield, Lock, FileText, Mail } from "lucide-react"

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: "What We Collect",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Honestly, not much:</p>
          <ul className="list-none pl-6 space-y-2">
            <li>• Your email and profile info if you sign in (handled by Clerk)</li>
            <li>• Basic analytics like page views and device type (Google Analytics, Vercel Analytics, Microsoft Clarity)</li>
            <li>• Your AI prompts are sent to Stability AI to generate images — we don&apos;t store them</li>
          </ul>
          <p className="text-muted-foreground">We don&apos;t have a database. No download history, no search logs, no tracking profiles. Everything happens in your browser.</p>
        </div>
      )
    },
    {
      icon: Lock,
      title: "Cookies & Storage",
      content: (
        <div className="space-y-4">
          <ul className="list-none pl-6 space-y-2">
            <li>• Clerk sets cookies to keep you logged in</li>
            <li>• Analytics services may set their own cookies</li>
            <li>• Your theme preference (dark/light) is saved in your browser</li>
            <li>• AI-generated images only live in your browser tab — refresh and they&apos;re gone</li>
          </ul>
        </div>
      )
    },
    {
      icon: FileText,
      title: "Third-Party Services",
      content: (
        <div className="space-y-4">
          <p className="text-lg">We use these services to keep things running:</p>
          <ul className="list-none pl-6 space-y-2">
            <li>• <strong>Clerk</strong> — authentication</li>
            <li>• <strong>ImageKit</strong> — hosts all the wallpapers</li>
            <li>• <strong>Stability AI</strong> — powers AI image generation</li>
            <li>• <strong>Google Analytics</strong> &amp; <strong>Microsoft Clarity</strong> — helps us see if anyone actually visits</li>
            <li>• <strong>Vercel</strong> — hosting and deployment</li>
          </ul>
          <p className="text-muted-foreground">Each of these has their own privacy policy. We don&apos;t control what they collect on their end.</p>
        </div>
      )
    },
    {
      icon: Mail,
      title: "Contact",
      content: (
        <div className="space-y-4">
          <p>If you have questions or want your data deleted, reach out:</p>
          <ul className="list-none pl-6 space-y-2">
            <li>• Email: prasen.nayak@hotmail.com</li>
          </ul>
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