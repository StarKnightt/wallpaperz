import { Button } from "@/components/ui/button"
import { Download, Image as ImageIcon, Bookmark } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Find Your Perfect <span className="text-yellow-400">Wallpaper</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Discover thousands of stunning wallpapers for your desktop and mobile devices. 
                Free downloads, high quality, and new additions daily.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="gap-2">
                  <ImageIcon size={20} />
                  Browse Collection
                </Button>
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20">
                  <Download size={20} />
                  Popular Downloads
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold">1000+</p>
                  <p className="text-sm opacity-75">Wallpapers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50k+</p>
                  <p className="text-sm opacity-75">Downloads</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">100+</p>
                  <p className="text-sm opacity-75">Categories</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative">
              {/* Add a collage of sample wallpapers here */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-lg transform translate-y-8">
                    <img src="/sample1.jpg" alt="Sample wallpaper" className="w-full h-48 object-cover" />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img src="/sample2.jpg" alt="Sample wallpaper" className="w-full h-48 object-cover" />
                  </div>
                </div>
                <div className="space-y-4 transform translate-y-16">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img src="/sample3.jpg" alt="Sample wallpaper" className="w-full h-48 object-cover" />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img src="/sample4.jpg" alt="Sample wallpaper" className="w-full h-48 object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
