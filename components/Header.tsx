"use client"
import { useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Moon, Sun } from "lucide-react"
import { useSearch } from "@/context/SearchContext"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"

export default function Header() {
  const { searchQuery, setSearchQuery } = useSearch()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push('/#search-results')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (!e.target.value) {
      router.push('/')
    }
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
              className="absolute left-3 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search wallpapers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
          </form>
        </div>
      </div>
    </header>
  )
}

