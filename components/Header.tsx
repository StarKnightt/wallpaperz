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

export default function Header() {
  const { searchQuery, setSearchQuery } = useSearch()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      setIsSearching(true)
      try {
        // Show quick suggestions while typing
        if (value.length > 2) {
          setSuggestions([
            `${value} wallpaper HD`,
            `${value} background 4K`,
            `${value} aesthetic`,
          ])
        }
        setSearchQuery(value)
        if (!value) {
          router.push('/')
        } else {
          router.push('/#search-results')
        }
      } finally {
        setIsSearching(false)
      }
    }, 400), // Slightly faster response
    [setSearchQuery, router]
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push('/#search-results')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Update local state immediately for input value
    setSearchQuery(value)
    // Debounce the actual search
    debouncedSearch(value)
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
            />
            {suggestions.length > 0 && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSearchQuery(suggestion)
                      router.push('/#search-results')
                    }}
                  >
                    {suggestion}
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

