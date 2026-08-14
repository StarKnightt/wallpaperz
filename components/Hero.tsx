"use client"
import { Button } from "@/components/ui/button"
import { Search, Sparkles, Download, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"
import { DEFAULT_CATEGORY } from "@/context/SearchContext"
import Link from "next/link"

interface SearchSuggestion {
  title: string;
  description: string;
  query: string;
}

const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight'
const thumb = (file: string) => `${IK}/wallpapers/${file}?tr=w-420,q-55,f-auto`

// Curated backdrop collage - low-res transformed thumbnails, purely decorative
const COLLAGE_COLUMNS: string[][] = [
  [
    'aurora-borealis-mountain-lake-2k-wallpaperz.jpg',
    'synthwave-outrun-supercar-sunset-2k-wallpaperz.jpg',
    'zen-garden-crimson-maple-mist-2k-wallpaperz.jpg',
    'abstract-liquid-chrome-waves-2k-wallpaperz.jpg',
  ],
  [
    'anime-torii-gate-sky-lanterns-2k-wallpaperz.jpg',
    'violet-spiral-nebula-ringed-planet-2k-wallpaperz.jpg',
    'minimal-desert-dunes-dusk-2k-wallpaperz.jpg',
    'space-cosmic-nebula-4k-wallpaperz.jpg',
  ],
  [
    'cyberpunk-rain-street-neon-2k-wallpaperz.jpg',
    'fantasy-ember-dragon-above-clouds-2k-wallpaperz.jpg',
    'circuit-board-city-data-streams-2k-wallpaperz.jpg',
    'sunken-city-whale-godrays-2k-wallpaperz.jpg',
  ],
]

function CollageBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-[-10%] flex gap-3 sm:gap-4 justify-center">
        {COLLAGE_COLUMNS.map((column, colIndex) => (
          <div
            key={colIndex}
            className={`flex flex-col gap-3 sm:gap-4 w-1/2 sm:w-1/3 shrink-0 ${
              colIndex === 1
                ? 'motion-safe:animate-hero-drift-down -mt-16'
                : 'motion-safe:animate-hero-drift-up'
            } ${colIndex === 2 ? 'hidden sm:flex' : ''}`}
          >
            {/* Duplicate the column so the drift loop never shows a gap */}
            {[...column, ...column].map((file, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- decorative thumbs already optimized via ImageKit transforms
              <img
                key={`${file}-${i}`}
                src={thumb(file)}
                alt=""
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className="w-full aspect-[16/10] object-cover rounded-xl select-none"
              />
            ))}
          </div>
        ))}
      </div>
      {/* Readability overlays */}
      <div className="absolute inset-0 bg-background/70 dark:bg-background/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
    </div>
  )
}

export default function Hero() {
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
    <div className="relative min-h-[55vh] sm:min-h-[60vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden">
      <CollageBackdrop />

      <div className="container px-4 py-12 sm:py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 backdrop-blur-md px-3 py-1 text-xs sm:text-sm text-muted-foreground mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Fresh drops weekly &middot; original AI art you won&apos;t find elsewhere</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] motion-safe:animate-text-shimmer">
                Wallpapers Worth Staring At
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Hand-picked and AI-crafted HD &amp; 4K wallpapers for your desktop and phone.
            Free forever, no sign-up, download in one click.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative flex items-center group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl transition-all group-hover:blur-2xl" />
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-28 h-14 text-base md:text-lg rounded-full border-2 bg-background/80 backdrop-blur-md transition-all focus:bg-background/95 focus:ring-2 focus:ring-primary/20"
                placeholder="Try &quot;space&quot;, &quot;anime&quot; or &quot;minimal&quot;..."
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
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex flex-col gap-0.5"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="font-medium">{suggestion.title}</span>
                    <span className="text-sm text-muted-foreground">{suggestion.description}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {[DEFAULT_CATEGORY, 'Abstract', 'Minimalist', 'Fantasy', 'Space', 'Anime'].map((tag) => (
              <Button
                key={tag}
                variant={activeCategory === tag ? "default" : "secondary"}
                size="sm"
                className={`rounded-full px-4 sm:px-5 backdrop-blur-md border transition-colors ${
                  activeCategory === tag ? '' : 'bg-background/60 hover:bg-primary/20'
                }`}
                onClick={() => handleCategoryClick(tag)}
              >
                {tag}
              </Button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1"
          >
            <span className="inline-flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-primary" />
              85+ curated wallpapers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download className="h-4 w-4 text-primary" />
              Full-res downloads, always free
            </span>
            <Link href="/ai-generate" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Sparkles className="h-4 w-4 text-primary" />
              Generate your own with AI
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
