"use client"
import { createContext, useContext, useState, ReactNode } from "react"

export const DEFAULT_CATEGORY = "Browse Wallpapers";

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  activeCategory: string
  setActiveCategory: (category: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  // Initialize activeCategory with DEFAULT_CATEGORY
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY)

  const clearSearch = () => setSearchQuery("")

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      clearSearch,
      activeCategory, 
      setActiveCategory 
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider")
  }
  return context
}
