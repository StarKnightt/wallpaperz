"use client"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Moon, Sun, Menu, X, Github, Star } from "lucide-react"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import debounce from 'lodash/debounce' 
import { UserButton, SignInButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Navigation from "@/components/Navigation"

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'AI Generate', href: '/ai-generate' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { isSignedIn, isLoaded } = useAuth()
  const { searchQuery, setSearchQuery } = useSearch()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [starCount, setStarCount] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const CACHE_KEY = 'github_star_count'
    const CACHE_DURATION = 1000 * 60 * 60

    const fetchStarCount = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { count, timestamp } = JSON.parse(cached)
          const isExpired = Date.now() - timestamp > CACHE_DURATION
          
          if (!isExpired) {
            setStarCount(count)
            return
          }
        }

        const response = await fetch('https://api.github.com/repos/StarKnightt/wallpaperz')
        if (response.ok) {
          const data = await response.json()
          const count = data.stargazers_count
          
          setStarCount(count)
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            count,
            timestamp: Date.now()
          }))
        }
      } catch (error) {
        console.error('Failed to fetch star count:', error)
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { count } = JSON.parse(cached)
          setStarCount(count)
        }
      }
    }
    
    fetchStarCount()
  }, [])

  const debouncedSearch = useCallback((value: string) => {
    setIsSearching(true)
    try {
      if (value.length >= 3) {
        router.push('/#search-results')
      }
    } finally {
      setIsSearching(false)
    }
  }, [router])

  const debouncedSearchHandler = useMemo(
    () => debounce(debouncedSearch, 600),
    [debouncedSearch]
  )

  useEffect(() => {
    return () => {
      debouncedSearchHandler.cancel()
    }
  }, [debouncedSearchHandler])

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push('/#search-results')
      setIsMobileSearchOpen(false)
    }
  }, [router, searchQuery, setIsMobileSearchOpen])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.length >= 3) {
      debouncedSearchHandler(value)
    } else if (!value) {
      router.push('/')
    }
  }, [debouncedSearchHandler, router, setSearchQuery])

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-200",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="hidden md:flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              Wallpaperz
            </Link>
            <Navigation />
            
            <Link
              href="https://github.com/StarKnightt/wallpaperz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted/50 hover:bg-muted rounded-full transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>{starCount !== null ? starCount : '...'}</span>
            </Link>
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

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {!isLoaded ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button variant="default" size="sm">
                  Sign in
                </Button>
              </SignInButton>
            )}
          </div>
        </div>

        <div className="md:hidden flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="py-6">
                    <Link href="/" className="text-xl font-bold">
                      Wallpaperz
                    </Link>
                  </div>
                  <Navigation />
                  
                  <div className="mt-4">
                    <Link
                      href="https://github.com/StarKnightt/wallpaperz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                      {starCount !== null && (
                        <div className="ml-auto bg-muted px-1.5 py-0.5 rounded-full text-xs">
                          {starCount}
                        </div>
                      )}
                    </Link>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!isLoaded ? (
                          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                        ) : isSignedIn ? (
                          <UserButton afterSignOutUrl="/" />
                        ) : (
                          <SignInButton mode="modal" fallbackRedirectUrl="/">
                            <Button variant="default" size="sm">
                              Sign in
                            </Button>
                          </SignInButton>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                      >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link href="/" className="text-xl font-bold">
              Wallpaperz
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/StarKnightt/wallpaperz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-muted/50 hover:bg-muted rounded-full transition-colors"
            >
              <Github className="h-4 w-4" />
            </Link>
            
            {isMobileSearchOpen ? (
              <form onSubmit={handleSubmit} className="absolute inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-md p-4 flex items-center gap-2 border-b">
                <Input
                  type="search"
                  placeholder="Search wallpapers..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="flex-1"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            {!isLoaded ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button variant="default" size="sm" className="px-3">
                  Sign in
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

