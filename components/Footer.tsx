import Link from "next/link"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"

export default function Footer() {
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
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {["Nature", "Abstract", "Minimal", "Urban", "Space"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
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
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              {["About Us", "Privacy Policy", "Terms", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
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
    </footer>
  )
}
