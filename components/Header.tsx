import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-background shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-2xl font-bold">
            Wallpaperz
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/popular" className="text-sm hover:text-primary">Popular</Link>
            <Link href="/latest" className="text-sm hover:text-primary">Latest</Link>
            <Link href="/categories" className="text-sm hover:text-primary">Categories</Link>
          </nav>
        </div>
        <div className="flex gap-4 items-center">
          <Input 
            type="search" 
            placeholder="Search wallpapers..." 
            className="w-full md:w-[400px]" 
          />
          <Button variant="outline">Search</Button>
        </div>
      </div>
    </header>
  )
}

