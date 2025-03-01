"use client"
import { motion } from "framer-motion"
import { Mail, MessageSquare, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useState } from "react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success("Message sent! We'll get back to you soon.")
    setIsSubmitting(false)
    
    // Reset form
    const form = e.target as HTMLFormElement
    form.reset()
  }

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
            Contact Us
          </h1>
          <p className="text-xl text-center text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our team
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-primary/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="How can we help?"
                    className="min-h-[150px] resize-none"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info - Enhanced version */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-primary/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
              <div className="grid gap-6">
                {[
                  {
                    icon: Mail,
                    title: "Email Us",
                    details: "prasen.nayak@hotmail.com",
                    description: "For general inquiries and support"
                  },
                  {
                    icon: MessageSquare,
                    title: "Discord Community",
                    details: "Coming Soon",
                    description: "Join our community for real-time support"
                  },
                  {
                    icon: Clock,
                    title: "Response Time",
                    details: "Within 24-48 hours",
                    description: "We aim to respond as quickly as possible"
                  },
                  {
                    icon: AlertCircle,
                    title: "Support Hours",
                    details: "Monday to Friday",
                    description: "9 AM - 5 PM IST"
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
                  >
                    <item.icon className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-primary">{item.details}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}