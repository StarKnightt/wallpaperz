"use client"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"
import ComingSoonModal from "./ComingSoonModal"
import { useState } from "react"

export default function Footer() {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState("")

  const handleComingSoonClick = (e: React.MouseEvent<HTMLAnchorElement>, feature: string) => {
    if (feature !== "About Us" && feature !== "Privacy Policy") {
      e.preventDefault()
      setComingSoonFeature(feature)
      setShowComingSoon(true)
    }
  }

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Wallpaperz</h3>
            <p className="text-muted-foreground">
              Your daily source for stunning wallpapers. Free downloads, high quality, updated daily.
            </p>
            <div className="flex gap-4">
              <Link href="/twitter" className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </Link>
              <Link href="/github" className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {["Nature", "Abstract", "Minimal", "Urban", "Space"].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary"
                    onClick={(e) => handleComingSoonClick(e, item)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Popular", "Latest", "Collections", "Request"].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary"
                    onClick={(e) => handleComingSoonClick(e, item)}
                  >
                    {item}
                  </Link>
                </li>
              ))} 
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wallpaperz. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for wallpaper enthusiasts
          </p>
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
