"use client"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Moon, Sun, Menu, X } from "lucide-react"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import debounce from 'lodash/debounce' 
import { Skeleton } from "@/components/ui/skeleton" 
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"

// Fix type issues
interface SearchSuggestion {
  title: string
  description: string
  query: string
}

export default function Header() {
  const { isSignedIn, isLoaded } = useAuth()
  const { searchQuery, setSearchQuery } = useSearch()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isScrolled, setIsScrolled] = useState(false)

  // Fix useCallback dependency and typing
  const generateSuggestions = useCallback((value: string): SearchSuggestion[] => {
    if (!value) return [];
    return [
      {
        title: `${value} Wallpapers`,
        description: "Find HD desktop backgrounds",
        query: `${value} wallpaper`
      },
      {
        title: `${value} 4K`, // Fixed missing title
        description: "Ultra high resolution wallpapers",
        query: `${value} 4k`
      },
      {
        title: `${value} Aesthetic`,
        description: "Stylish and artistic designs",
        query: `${value} aesthetic`
      }
    ];
  }, []);

  const debouncedSearch = useCallback(
    (value: string) => {
      setIsSearching(true);
      try {
        if (value.length >= 3) {
          setSuggestions(generateSuggestions(value));
          router.push('/#search-results');
        } else {
          setSuggestions([]);
        }
      } finally {
        setIsSearching(false);
      }
    },
    [generateSuggestions, router]
  );

  // Wrap debounce outside useCallback
  const debouncedSearchHandler = useMemo(
    () => debounce(debouncedSearch, 600),
    [debouncedSearch]
  );

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
      debouncedSearchHandler(value)
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

  // Disable ESLint for this specific instance as we intentionally want an empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 20)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <header className="bg-background shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
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

          <div className="flex items-center gap-4">
            <form onSubmit={handleSubmit} className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSearching ? 'animate-pulse' : ''} text-muted-foreground`} size={20} />
              <Input
                type="search"
                placeholder={isSearching ? "Searching..." : "Search wallpapers..."}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-[300px]"
                autoComplete="off"
                spellCheck="false"
              />
            </form>

            {!isLoaded ? (
              <Button variant="ghost" size="sm">Loading...</Button>
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button variant="default" size="sm">
                  Sign in
                </Button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Wallpaperz
          </Link>

          <div className="flex items-center gap-2">
            {!isLoaded ? (
              <Button variant="ghost" size="sm">Loading...</Button>
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button variant="default" size="sm">
                  Sign in
                </Button>
              </SignInButton>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <form onSubmit={handleSubmit} className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSearching ? 'animate-pulse' : ''} text-muted-foreground`} size={20} />
              <Input
                type="search"
                placeholder={isSearching ? "Searching..." : "Search wallpapers..."}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-full"
                autoComplete="off"
                spellCheck="false"
              />
            </form>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

