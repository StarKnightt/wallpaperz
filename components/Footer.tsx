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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
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
                <Link href="/ai-generate" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Generate
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Colors */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-3">By Color</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/color/dark" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dark Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/color/black" className="text-muted-foreground hover:text-foreground transition-colors">
                  Black Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/color/blue" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blue Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/color/purple" className="text-muted-foreground hover:text-foreground transition-colors">
                  Purple Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/color/pink" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pink Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/color/orange" className="text-muted-foreground hover:text-foreground transition-colors">
                  Orange Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/color/green" className="text-muted-foreground hover:text-foreground transition-colors">
                  Green Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/color/yellow" className="text-muted-foreground hover:text-foreground transition-colors">
                  Yellow Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/color/white" className="text-muted-foreground hover:text-foreground transition-colors">
                  White Wallpapers
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
                  href="https://www.pinterest.com/wallpaperzin" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {/* lucide-react has no Pinterest brand icon; inline SVG sized like the others */}
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                  Pinterest
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
