"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AIGeneratePage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-4 mb-8 pt-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="relative">
          {/* Animated glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 animate-pulse" />
          <div className="relative bg-background rounded-lg p-8 space-y-4">
            <div className="flex justify-center mb-6">
              <Sparkles className="w-12 h-12 text-purple-500 animate-pulse" />
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Wallpaper Generator
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Coming Soon
            </p>
            
            <p className="text-muted-foreground max-w-lg mx-auto">
              We're working on something amazing! Soon you'll be able to generate unique, 
              stunning wallpapers using the power of artificial intelligence.
            </p>

            <div className="pt-6">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Wallpapers
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature preview list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Custom Prompts</h3>
            <p className="text-sm text-muted-foreground">
              Describe your perfect wallpaper and watch it come to life
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Multiple Styles</h3>
            <p className="text-sm text-muted-foreground">
              Choose from various artistic styles and aesthetics
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">High Resolution</h3>
            <p className="text-sm text-muted-foreground">
              Get beautiful wallpapers in crisp, high quality
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 