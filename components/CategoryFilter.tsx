"use client"

import { useSearch, DEFAULT_CATEGORY } from "@/context/SearchContext"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory?: string | null
  onSelectCategory?: (category: string) => void
}

export default function CategoryFilter({ 
  categories,
  selectedCategory: propSelectedCategory,
  onSelectCategory
}: CategoryFilterProps) {
  const { activeCategory, setActiveCategory, setSearchQuery } = useSearch()
  
  // Add the default "All" category
  const allCategories = [DEFAULT_CATEGORY, ...categories]
  
  const handleCategoryClick = (category: string) => {
    // If external handler is provided, use it
    if (onSelectCategory) {
      onSelectCategory(category)
      return
    }
    
    // Otherwise use the context
    setActiveCategory(category)
    setSearchQuery("") // Clear search when selecting a category
  }
  
  // Use the prop value if provided, otherwise use context
  const currentCategory = propSelectedCategory !== undefined ? propSelectedCategory : activeCategory
  
  return (
    <div className="w-full mb-8">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-1">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                currentCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  )
}

