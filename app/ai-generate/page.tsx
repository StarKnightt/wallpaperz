"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Loader2, Download, AlertCircle, Share2, Wand2, Eye, X, ZoomIn, MonitorSmartphone } from "lucide-react"
import NoiseField from "@/components/ai/NoiseField"
import GenerationDemo from "@/components/ai/GenerationDemo"
import ScreenPreview from "@/components/ScreenPreview"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth, SignInButton } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"

const GEN_STEPS = ["Reading your prompt", "Composing the scene", "Adding light and color", "Sharpening details", "Almost there"]

/** Honest-ish progress: steps advance on a timer and hold on the last one until the API returns. */
function GeneratingSteps() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 200)
    return () => clearInterval(id)
  }, [])
  const step = Math.min(GEN_STEPS.length - 1, Math.floor(elapsed / 3.5))
  const pct = Math.min(95, (elapsed / 18) * 100)
  return (
    <>
      <div className="mb-2 flex justify-between text-xs font-medium text-white/85">
        <span>{GEN_STEPS[step]}…</span>
        <span className="tabular-nums">{elapsed.toFixed(0)}s</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>
    </>
  )
}

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
  const [isMockupOpen, setIsMockupOpen] = useState(false)
  
  const promptSuggestions = [
    "Massive aurora borealis over a snow-covered mountain range reflected in a still lake, photorealistic, 8K, cinematic lighting",
    "Cyberpunk Tokyo alleyway at night, rain-soaked neon signs, holographic billboards, volumetric fog, ultra detailed digital art",
    "Vast alien desert with two moons rising, bioluminescent sand dunes, sci-fi concept art, dramatic sky, wide angle",
    "Dark enchanted forest with glowing fireflies, mystical fog, ancient trees with twisted roots, fantasy matte painting, moody atmosphere",
    "Minimalist abstract waves in deep ocean blue and soft gold gradients, smooth flowing shapes, elegant wallpaper design, 4K",
    "Japanese garden in autumn with a red torii gate, falling maple leaves, koi pond reflection, golden hour light, serene and peaceful",
    "Floating islands above the clouds at sunset, waterfalls cascading into the void, lush greenery, epic fantasy landscape, wide panoramic view",
    "Retro synthwave grid stretching into a neon sunset horizon, chrome mountains, vaporwave aesthetic, vibrant purple and pink palette"
  ]

  const demoImages = [
    "https://ik.imagekit.io/starknight/wallpapers/cyberpunk-rain-street-neon-2k-wallpaperz.jpg",
    "https://ik.imagekit.io/starknight/wallpapers/anime-torii-gate-sky-lanterns-2k-wallpaperz.jpg",
    "https://ik.imagekit.io/starknight/wallpapers/fantasy-ember-dragon-above-clouds-2k-wallpaperz.jpg",
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
      fetch(generatedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const timestamp = new Date().getTime()
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `wallpaperz-ai-${timestamp}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
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
        const blob = await fetch(generatedImage).then(r => r.blob())
        const file = new File([blob], 'wallpaper.png', { type: 'image/png' })
        
        await navigator.share({
          title: 'My AI-generated wallpaper',
          text: 'Check out this wallpaper I created with AI!',
          files: [file]
        })
      } else {
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
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_70%)]" />

        <div className="container mx-auto px-4 pb-20 pt-10 sm:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md sm:text-sm">
              <Wand2 className="h-3.5 w-3.5 shrink-0 text-fuchsia-500" />
              AI wallpaper generator
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Type a sentence.
              <span className="block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 bg-clip-text pb-1 text-transparent">
                Get a wallpaper.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              Describe any scene and get an original 1344&times;768 wallpaper in about 15 seconds.
              Nobody else will have it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10"
          >
            <GenerationDemo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <SignInButton mode="modal" fallbackRedirectUrl="/ai-generate">
              <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-8 text-base text-white shadow-lg shadow-fuchsia-500/25 transition-transform hover:-translate-y-0.5 hover:opacity-95">
                <Sparkles className="mr-2 h-4 w-4" />
                Sign in to start creating
              </Button>
            </SignInButton>
            <p className="text-xs text-muted-foreground">Free &middot; 5 wallpapers an hour &middot; download in full quality</p>
          </motion.div>

          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">AI originals in our library</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {demoImages.map((src, n) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: n * 0.08 }}
                  className="group relative aspect-[16/9] overflow-hidden rounded-xl border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- ImageKit-sized */}
                  <img
                    src={`${src.split("?")[0]}?tr=w-640,q-75,f-auto`}
                    alt="Original AI wallpaper from the Wallpaperz library"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm font-medium text-fuchsia-500 hover:underline">
                Browse the full library &rarr;
              </Link>
            </div>
          </section>

          <section className="mx-auto mt-16 max-w-3xl">
            <h2 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Prompts to steal</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {promptSuggestions.slice(0, 6).map((p) => (
                <SignInButton key={p} mode="modal" fallbackRedirectUrl="/ai-generate">
                  <button type="button" className="rounded-full border bg-card px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-fuchsia-500/50 hover:text-foreground">
                    {p.split(",")[0]}
                  </button>
                </SignInButton>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
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
                      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                        <NoiseField />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                          <GeneratingSteps />
                        </div>
                      </div>
                    ) : generatedImage ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                      >
                        <div 
                          className="relative w-full aspect-video mx-auto border rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                          onClick={() => setIsPreviewOpen(true)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={generatedImage}
                            alt="Generated wallpaper"
                            className="w-full h-full object-cover motion-safe:animate-diffuse-in"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsPreviewOpen(true)}
                            className="flex gap-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsMockupOpen(true)}
                            className="flex gap-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                          >
                            <MonitorSmartphone className="h-4 w-4" />
                            Try on screen
                          </Button>
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
                            className="flex gap-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                          >
                            <Sparkles className="h-4 w-4" />
                            New Image
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="relative flex w-full aspect-[16/9] flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed text-center">
                        <NoiseField className="opacity-25" intensity={0.4} />
                        <div className="relative px-6">
                          <Sparkles className="mx-auto h-10 w-10 text-fuchsia-400" />
                          <p className="mt-4 font-medium text-lg">Your wallpaper will appear here</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Describe a scene, then press Generate. Takes about 15 seconds.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
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

      {generatedImage && (
        <ScreenPreview
          open={isMockupOpen}
          onClose={() => setIsMockupOpen(false)}
          imageUrl={generatedImage}
          title="Your AI wallpaper"
          isPortrait={false}
        />
      )}

      <AnimatePresence>
        {isPreviewOpen && generatedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[95vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage}
                alt="Generated wallpaper preview"
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}