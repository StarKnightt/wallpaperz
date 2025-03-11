"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Loader2, Download, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth, SignInButton } from "@clerk/nextjs"
import Image from "next/image"
import { saveAs } from "file-saver"

interface FormValues {
  prompt: string
  negativePrompt: string
  style: "realistic" | "artistic" | "anime"
}

export default function AIGeneratePage() {
  const { isSignedIn, isLoaded } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      prompt: "",
      negativePrompt:
        "low quality, blurry, distorted, deformed, disfigured, bad anatomy, watermark, signature",
      style: "realistic",
    },
  })

  const selectedStyle = watch("style")

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
          style: data.style,
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

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isSignedIn) {
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

        <div className="max-w-lg mx-auto text-center py-20 space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25" />
            <div className="relative bg-background rounded-lg p-8 space-y-4">
              <div className="flex justify-center mb-6">
                <Sparkles className="w-12 h-12 text-purple-500" />
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Wallpaper Generator
              </h1>

              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                Sign in to create unique, stunning wallpapers using our AI generator.
              </p>

              <SignInButton mode="modal" fallbackRedirectUrl="/ai-generate">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
                  Sign in to Continue
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

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

      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block">
            AI Wallpaper Generator
          </h1>
          <p className="text-muted-foreground">
            Create unique wallpapers using artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <div>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe your wallpaper</Label>
                <Textarea
                  id="prompt"
                  placeholder="A stunning mountain landscape at sunset with vibrant colors and dramatic clouds"
                  className="h-32 resize-none"
                  {...register("prompt", {
                    required: "Please provide a description for your wallpaper",
                  })}
                />
                {errors.prompt && (
                  <p className="text-sm text-red-500">{errors.prompt.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Be descriptive and specific about what you want to see.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="negativePrompt">
                  What to avoid <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="negativePrompt"
                  placeholder="Low quality, blurry, distorted"
                  className="h-20 resize-none"
                  {...register("negativePrompt")}
                />
                <p className="text-xs text-muted-foreground">
                  Elements you don't want in your image.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Style</Label>
                <RadioGroup
                  defaultValue="realistic"
                  className="grid grid-cols-3 gap-4"
                  {...register("style")}
                >
                  <Card
                    className={`cursor-pointer border-2 ${
                      selectedStyle === "realistic" ? "border-primary" : "border-border"
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <RadioGroupItem value="realistic" id="realistic" className="sr-only" />
                      <Label htmlFor="realistic" className="cursor-pointer">
                        <div className="font-medium mb-1">Realistic</div>
                        <p className="text-xs text-muted-foreground">Photorealistic style</p>
                      </Label>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 ${
                      selectedStyle === "artistic" ? "border-primary" : "border-border"
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <RadioGroupItem value="artistic" id="artistic" className="sr-only" />
                      <Label htmlFor="artistic" className="cursor-pointer">
                        <div className="font-medium mb-1">Artistic</div>
                        <p className="text-xs text-muted-foreground">Creative and stylized</p>
                      </Label>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 ${
                      selectedStyle === "anime" ? "border-primary" : "border-border"
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <RadioGroupItem value="anime" id="anime" className="sr-only" />
                      <Label htmlFor="anime" className="cursor-pointer">
                        <div className="font-medium mb-1">Anime</div>
                        <p className="text-xs text-muted-foreground">Japanese animation</p>
                      </Label>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
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
                    Generate Wallpaper
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Result Column */}
          <div>
            <div className="rounded-lg overflow-hidden border bg-card text-card-foreground h-full">
              <div className="p-4 border-b">
                <h3 className="font-medium">Generated Wallpaper</h3>
              </div>

              <div className="p-6 flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                    <p className="text-muted-foreground">Creating your custom wallpaper...</p>
                    <p className="text-xs text-muted-foreground mt-2">This may take up to 30 seconds</p>
                  </div>
                ) : generatedImage ? (
                  <div className="space-y-4 w-full">
                    <div className="relative aspect-square w-full max-w-[400px] mx-auto border rounded-lg overflow-hidden">
                      <Image
                        src={generatedImage}
                        alt="Generated wallpaper"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={handleDownload} className="flex gap-2">
                        <Download className="h-4 w-4" />
                        Download Wallpaper
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Sparkles className="h-10 w-10 mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Your generated wallpaper will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>      
      </div>
    </div>
  )
}