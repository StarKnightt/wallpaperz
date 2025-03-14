"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Github, Coffee, Globe, ExternalLink } from "lucide-react"
import ComingSoonModal from "./ComingSoonModal"
import { useState } from "react"

export default function Footer() {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState("")
  const currentYear = new Date().getFullYear()

  const handleComingSoonClick = (e: React.MouseEvent<HTMLAnchorElement>, feature: string) => {
    if (feature !== "About Us" && feature !== "Privacy Policy") {
      e.preventDefault()
      setComingSoonFeature(feature)
      setShowComingSoon(true)
    }
  }

  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              Wallpaperz
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Beautiful wallpapers for your devices, powered by AI and curated with care.
            </p>
            
            {/* Portfolio Link - Added */}
            <Link 
              href="https://prasen.dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>prasen.dev</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/ai-generate" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Generate
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/license" className="text-muted-foreground hover:text-foreground transition-colors">
                  License
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-3">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="https://github.com/StarKnightt/wallpaperz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="https://buymeacoffee.com/prasen" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Coffee className="h-4 w-4" />
                  Buy Me a Coffee
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright and Open Source */}
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Wallpaperz. All rights reserved.
            </p>
            <Link 
              href="https://prasen.dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Created by Prasen
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/StarKnightt/wallpaperz" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              Open Source Project
            </Link>
            <Link 
              href="https://buymeacoffee.com/prasen" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Coffee className="h-4 w-4" />
              Support
            </Link>
          </div>
        </div>
      </div>
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        feature={comingSoonFeature}
      />
    </footer>
  )
}
