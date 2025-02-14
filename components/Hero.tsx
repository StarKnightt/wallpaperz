import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"

const suggestions = [
  "Anime wallpapers",
  "Abstract art",
  "Minimal designs",
  "Dark themes",
  "Landscapes"
]

export default function Hero() {
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useSearch()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSuggestion(prev => (prev + 1) % suggestions.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push('/#search-results')
    }
  }

  return (
    <section className="relative bg-black/5 dark:bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto py-20 md:py-32 text-center space-y-6">
          {/* Main Heading */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Best Wallpapers for Your Screen
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Browse through our curated collection of high-quality wallpapers
          </motion.p>

          {/* Search Form */}
          <motion.form 
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 h-14 text-base md:text-lg rounded-full border-2 focus:ring-2 focus:ring-primary/20"
                placeholder={suggestions[currentSuggestion]}
              />
              <Button 
                type="submit"
                size="lg"
                className="absolute right-2 rounded-full px-6"
              >
                Search
              </Button>
            </div>
          </motion.form>

          {/* Trending Tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {['4K','Abstract','Anime'].map((tag) => (
              <Button
                key={tag}
                variant="secondary"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setSearchQuery(tag)
                  router.push('/#search-results')
                }}
              >
                {tag}
              </Button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex justify-center gap-8 mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div>
              <span className="font-bold text-foreground">28+ </span>
              Wallpapers
            </div>
            <div>
              <span className="font-bold text-foreground">100+ </span>
              Downloads
            </div>
            <div>
              <span className="font-bold text-foreground">3+ </span>
              Categories
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
