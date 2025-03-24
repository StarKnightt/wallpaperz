"use client"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"
import { DEFAULT_CATEGORY } from "@/context/SearchContext"
import { useTheme } from "next-themes"

interface SearchSuggestion {
  title: string;
  description: string;
  query: string;
}

const GridBackground = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
    }} />
  </div>
)

export default function Hero() {
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const router = useRouter()
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useSearch()
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

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
    if (value.length >= 2) {
      setSuggestions(generateSuggestions(value))
    } else {
      setSuggestions([])
    }
  }

  const performSearch = (query: string) => {
    if (query.trim()) {
      router.replace(`/?search=${encodeURIComponent(query)}#search-results`, { scroll: false })
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
      setSearchQuery(tag)
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
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/50">
      <GridBackground />
      <div className="absolute inset-0 bg-background/30 backdrop-blur-xl" />

      <div className="container px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Discover Stunning Wallpapers
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Transform your screen with our curated collection of high-resolution wallpapers
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl transition-all group-hover:blur-2xl" />
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 h-14 text-base md:text-lg rounded-full border-2 bg-background/70 backdrop-blur-sm transition-all focus:bg-background/90 focus:ring-2 focus:ring-primary/20"
                placeholder="Search wallpapers..."
                autoComplete="off"
                spellCheck="false"
              />
              <Button 
                type="submit"
                size="lg"
                className="absolute right-2 rounded-full px-6 bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity"
              >
                Search
              </Button>
            </div>
            
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border rounded-lg shadow-lg overflow-hidden z-50">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex flex-col gap-0.5"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="font-medium">{suggestion.title}</span>
                    <span className="text-sm text-muted-foreground">{suggestion.description}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[DEFAULT_CATEGORY, 'Abstract', 'Minimalist', 'Fantasy', 'Art'].map((tag) => (
              <Button
                key={tag}
                variant={activeCategory === tag ? "default" : "secondary"}
                size="lg"
                className="rounded-full px-6 backdrop-blur-sm hover:bg-primary/20 transition-colors"
                onClick={() => handleCategoryClick(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
    </div>
  )
}
