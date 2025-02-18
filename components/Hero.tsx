"use client"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"
import { motion, AnimatePresence, useAnimationControls } from "framer-motion"
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"
import { DEFAULT_CATEGORY } from "@/context/SearchContext"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { useTheme } from "next-themes"

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
  const { theme } = useTheme()
  const controls = useAnimationControls()

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
    if (tag === DEFAULT_CATEGORY) {
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
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, 
              ${theme === 'dark' ? 'rgba(126, 34, 206, 0.2)' : 'rgba(168, 85, 247, 0.1)'}, 
              ${theme === 'dark' ? 'rgba(219, 39, 119, 0.2)' : 'rgba(236, 72, 153, 0.1)'},
              ${theme === 'dark' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(251, 146, 60, 0.1)'})`
          }}
          animate={{
            backgroundSize: ["100% 100%", "200% 200%"],
            backgroundPosition: ["0% 0%", "100% 100%"]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
        
        {/* Sparkles Effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                repeatType: "loop"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Content with enhanced animations */}
      <div className="container px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
           The Best Wallpapers for Your Screen
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
          Discover a curated collection of stunning wallpapers for your desktop.
          </motion.p>

          {/* Floating Elements */}
          <motion.div 
            className="absolute -z-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: '10%',
              top: '20%',
            }}
          />
          
          <motion.div 
            className="absolute -z-10 w-72 h-72 bg-pink-500/10 dark:bg-pink-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              right: '10%',
              bottom: '20%',
            }}
          />

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
            {[DEFAULT_CATEGORY, 'Abstract', 'Anime'].map((tag) => (
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
        </motion.div>
      </div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border border-white/10 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-glow" />
        </div>
      </div>
    </div>
  )
}
