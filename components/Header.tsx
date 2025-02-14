"use client"
import { useState, useCallback } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Moon, Sun } from "lucide-react"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import debounce from 'lodash/debounce' 
import { Skeleton } from "@/components/ui/skeleton" 

// Add these suggestion types
interface SearchSuggestion {
  title: string;
  description: string;
  query: string;
}

export default function Header() {
  const { searchQuery, setSearchQuery } = useSearch()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      setIsSearching(true)
      try {
        // Only show suggestions for 3 or more characters
        if (value.length >= 3) {
          setSuggestions(generateSuggestions(value))
          router.push('/#search-results')
        } else {
          setSuggestions([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 600), // Increased debounce time
    [router]
  )

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push('/#search-results')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value) // Update input value immediately
    
    // Only trigger search for 3 or more characters
    if (value.length >= 3) {
      debouncedSearch(value)
    } else {
      setSuggestions([])
      if (!value) {
        router.push('/')
      }
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.query)
    setSuggestions([])
    router.push('/#search-results')
  }

  return (
    <header className="bg-background shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold">
              Wallpaperz
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <form 
            onSubmit={handleSubmit}
            className="relative max-w-sm flex items-center"
          >
            <Search 
              size={20} 
              className={`absolute left-3 ${isSearching ? 'animate-pulse' : ''} text-muted-foreground`}
            />
            <Input
              type="search"
              placeholder={isSearching ? "Searching..." : "Search wallpapers..."}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-full"
              autoComplete="off"
              spellCheck="false"
            />
            {suggestions.length > 0 && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="font-medium">{suggestion.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {suggestion.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </header>
  )
}

