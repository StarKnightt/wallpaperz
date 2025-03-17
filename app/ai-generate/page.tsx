"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Loader2, Download, AlertCircle, Share2, Wand2, Eye, User } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth, SignInButton } from "@clerk/nextjs"
import Image from "next/image"
import { saveAs } from "file-saver"
import { motion } from "framer-motion"

interface FormValues {
  prompt: string
  negativePrompt: string
}

export default function AIGeneratePage() {
  const { isSignedIn, isLoaded } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const promptSuggestions = [
    "A breathtaking mountain landscape at sunset with vibrant colors",
    "Futuristic city skyline with neon lights and flying cars",
    "Tropical beach paradise with crystal clear water and palm trees",
    "Enchanted forest with glowing mushrooms and mystical creatures",
    "Abstract geometric patterns with vibrant gradient colors"
  ]

  const demoImages = [
    "https://ik.imagekit.io/starknight/AI-Demo/wallpaperz-ai-1741709708281_kQjMl55ZR.png?updatedAt=1741711241939",
    "https://ik.imagekit.io/starknight/AI-Demo/wallpaperz-ai-1741710553378_w7IibV2QA.png?updatedAt=1741711329095",
    "https://ik.imagekit.io/starknight/AI-Demo/wallpaperz-ai-1741711355599_X61ZQ9mv7.png?updatedAt=1741711391373"
  ]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      prompt: "",
      negativePrompt: "low quality, blurry, distorted, deformed, disfigured, bad anatomy, watermark, signature"
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsGenerating(true)
      setError(null)

      const response = await fetch("/api/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: data.prompt,
          negative_prompt: data.negativePrompt,
          // Default to desktop size with 16:9 aspect ratio
          size: "desktop"
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate image")
      }

      const result = await response.json()
      setGeneratedImage(result.image)
    } catch (err) {
      console.error("Generation failed:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      // Convert base64 to blob
      fetch(generatedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const timestamp = new Date().getTime()
          saveAs(blob, `wallpaperz-ai-${timestamp}.png`)
        })
        .catch((err) => {
          console.error("Download error:", err)
          setError("Failed to download the image")
        })
    }
  }
  
  const handleSuggestionClick = (suggestion: string) => {
    setValue("prompt", suggestion)
  }

  const handleReset = () => {
    setGeneratedImage(null)
    setError(null)
  }
  
  const handleShare = async () => {
    if (!generatedImage) return
    
    try {
      if (navigator.share) {
        // Use Web Share API if available
        const blob = await fetch(generatedImage).then(r => r.blob())
        const file = new File([blob], 'wallpaper.png', { type: 'image/png' })
        
        await navigator.share({
          title: 'My AI-generated wallpaper',
          text: 'Check out this wallpaper I created with AI!',
          files: [file]
        })
      } else {
        // Fallback: Copy image URL to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.error('Sharing failed:', err)
    }
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        {/* Grid background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
          }} />
        </div>
        
        <div className="container mx-auto px-4 pt-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="max-w-xl mx-auto text-center py-20 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                {/* Animated glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 animate-pulse" />
                <div className="relative bg-background/80 backdrop-blur-lg rounded-lg p-10 space-y-6">
                  <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full mb-2">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI Wallpaper Generator
                  </h1>
                  
                  <p className="text-xl text-muted-foreground">
                    Create stunning, unique wallpapers with AI
                  </p>
                  
                  <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                    Transform your ideas into beautiful wallpapers in seconds.
                    Sign in to start creating your own AI-generated masterpieces.
                  </p>
                  <SignInButton mode="modal" fallbackRedirectUrl="/ai-generate">
                    <Button size="lg" className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sign in to Create
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
        }} />
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        <div className="flex items-center gap-4 mb-4 pt-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block">
              AI Image Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your imagination into stunning wallpapers using AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-background/40 backdrop-blur-md rounded-xl p-6 border shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-lg font-medium">Describe your perfect wallpaper</Label>
                    <Textarea
                      id="prompt"
                      placeholder="A magical forest with glowing mushrooms and fairy lights at dusk"
                      className="h-40 resize-none text-base shadow-sm"
                      {...register("prompt", {
                        required: "Please provide a description for your wallpaper",
                      })}
                    />
                    {errors.prompt && (
                      <p className="text-sm text-red-500">{errors.prompt.message}</p>
                    )}
                    
                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium">Try these ideas:</h3>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            const randomIndex = Math.floor(Math.random() * promptSuggestions.length);
                            setValue("prompt", promptSuggestions[randomIndex]);
                          }}
                        >
                          <Wand2 className="h-3 w-3 mr-1" /> Random
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {promptSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-full text-secondary-foreground transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="negativePrompt" className="text-sm font-medium">
                        What to avoid <span className="text-xs text-muted-foreground">(optional)</span>
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => setValue("negativePrompt", "low quality, blurry, distorted, deformed, disfigured, bad anatomy, watermark, signature")}
                      >
                        Reset to default
                      </Button>
                    </div>
                    <Textarea
                      id="negativePrompt"
                      placeholder="Low quality, blurry, distorted"
                      className="h-20 resize-none text-sm"
                      {...register("negativePrompt")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Specify elements you don't want in your image to improve results.
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="flex flex-col gap-3 mt-4">
                      <Button
                        type="submit"
                        size="default"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white py-5 text-base shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px]"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate My Wallpaper
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Result Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden bg-background/40 backdrop-blur-md border shadow-sm">
                <CardContent className="p-0">
                  <div className="p-4 border-b bg-muted/40">
                    <h3 className="font-medium">Your Wallpaper</h3>
                  </div>

                  <div className="p-6 flex items-center justify-center min-h-[500px]">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative w-24 h-24">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-xl animate-pulse opacity-30"></div>
                          <div className="relative flex items-center justify-center w-full h-full">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-6 text-lg">Creating your masterpiece...</p>
                        <p className="text-xs text-muted-foreground mt-2 max-w-xs text-center">
                          This may take up to 30 seconds while our AI crafts your custom wallpaper
                        </p>
                      </div>
                    ) : generatedImage ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                      >
                        <div className="relative w-full aspect-video mx-auto border rounded-lg overflow-hidden shadow-lg">
                          <Image
                            src={generatedImage}
                            alt="Generated wallpaper"
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                            priority
                          />
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                          <Button 
                            variant="outline" 
                            onClick={handleDownload} 
                            className="flex gap-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleShare}
                            className="flex gap-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleReset}
                            className="flex gap-2 bg-background/80 backdrop-blur-sm hover:bg-background mt-3 sm:mt-0 w-full sm:w-auto"
                          >
                            <Sparkles className="h-4 w-4" />
                            Generate New Image
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="bg-purple-500/5 p-6 rounded-full">
                          <Sparkles className="h-14 w-14 text-purple-500/60" />
                        </div>
                        <p className="text-muted-foreground mt-6 font-medium text-lg">Your wallpaper will appear here</p>
                        <p className="text-xs text-muted-foreground mt-2 max-w-xs">
                          Describe what you want to see in the form on the left, then click Generate
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Pro tips */}
              {!isGenerating && !generatedImage && (
                <Card className="mt-6 bg-background/30 backdrop-blur-sm border">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Wand2 className="w-4 h-4 mr-2 text-purple-500" />
                      Pro Tips
                    </h3>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Be specific about lighting, colors, and atmosphere</li>
                      <li>Mention art styles like "digital art" or "photorealistic"</li>
                      <li>Use phrases like "8K", "high detail" for better quality</li>
                      <li>Describe the mood you want to evoke</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}