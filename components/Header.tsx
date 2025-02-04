import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="bg-background shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          WallpaperApp
        </Link>
        <div className="w-1/3">
          <Input type="search" placeholder="Search wallpapers..." />
        </div>
      </div>
    </header>
  )
}

