import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"

interface SearchSuggestion {
  title: string;
  description: string;
  query: string;
}

export default function Hero() {
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const router = useRouter()
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearch()
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])

  const generateSuggestions = (value: string): SearchSuggestion[] => {
    if (!value) return [];
    return [
      {
        title: `${value} Wallpapers`,
        description: "Find HD desktop backgrounds",
        query: `${value} wallpaper`
      },
      {
        title: `${value} 4K`,
        description: "Ultra high resolution wallpapers",
        query: `${value} 4k`
      },
      {
        title: `${value} Aesthetic`,
        description: "Stylish and artistic designs",
        query: `${value} aesthetic`
      }
    ];
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSuggestions([])
      performSearch(searchQuery)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    // Only update suggestions, no search/scroll
    if (value.length >= 2) {
      setSuggestions(generateSuggestions(value))
    } else {
      setSuggestions([])
    }
  }

  const performSearch = (query: string) => {
    if (query.trim()) {
      router.replace(`/?search=${encodeURIComponent(query)}#search-results`, { scroll: false })
      // Delayed smooth scroll
      setTimeout(() => {
        document.getElementById('search-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.query)
    setSuggestions([])
    performSearch(suggestion.query)
  }

  const handleCategoryClick = (tag: string) => {
    setActiveCategory(tag)
    if (tag === 'All') {
      setSearchQuery('')
      router.push('/#wallpapers-section')
    } else {
      setSearchQuery(tag) // Update search query with category name
      router.replace(`/?category=${encodeURIComponent(tag)}#search-results`, { scroll: false })
      setTimeout(() => {
        document.getElementById('search-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-background to-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto py-16 md:py-6 text-center space-y-6">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Best Wallpapers for Your Screen
          </motion.h1>

          {/* Enhanced Description */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-base md:text-lg text-muted-foreground">
              Discover a curated collection of stunning wallpapers for your desktop.
            </p>
          </motion.div>

          {/* Search Form with reduced top margin */}
          <motion.form 
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 h-14 text-base md:text-lg rounded-full border-2 focus:ring-2 focus:ring-primary/20"
                placeholder="Search wallpapers..."
                autoComplete="off"
                spellCheck="false"
              />
              <Button 
                type="submit"
                size="lg"
                className="absolute right-2 rounded-full px-6"
              >
                Search
              </Button>
            </div>
            
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden z-50">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex flex-col gap-0.5"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="font-medium">{suggestion.title}</span>
                    <span className="text-sm text-muted-foreground">{suggestion.description}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.form>

          {/* Category Filters with reduced spacing */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {['All', 'Abstract', 'Anime'].map((tag) => (
              <Button
                key={tag}
                variant={activeCategory === tag ? "default" : "secondary"}
                size="lg"
                className="rounded-full px-6"
                onClick={() => handleCategoryClick(tag)}
              >
                {tag}
              </Button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
