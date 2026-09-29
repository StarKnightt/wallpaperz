"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { AlertCircle, ArrowLeft, ArrowRight, Download, Expand, MonitorSmartphone, RotateCcw, Share2, Shuffle, X } from "lucide-react"
import NoiseField from "@/components/ai/NoiseField"
import GeneratingSteps from "@/components/ai/GeneratingSteps"
import UsageBar from "@/components/ai/UsageBar"
import UpsellCard from "@/components/ai/UpsellCard"
import ScreenPreview from "@/components/ScreenPreview"
import AiDisclosure from "@/components/legal/AiDisclosure"
import { useEntitlements } from "@/lib/hooks/useEntitlements"
import { usePaymentReturn } from "@/lib/hooks/usePaymentReturn"
import type { LimitCode } from "@/lib/pricing"
import { DEFAULT_NEGATIVE_PROMPT, PROMPT_EXAMPLES, STYLE_PRESETS, libraryImage, type StyleId } from "@/components/ai/examples"
import { cn } from "@/lib/utils"

const MAX_PROMPT = 1000
const EASE = [0.23, 1, 0.32, 1] as const

interface FormValues {
  prompt: string
  negativePrompt: string
}

const ghostBtn =
  "inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-border bg-background px-2 text-[13px] font-medium sm:gap-2 sm:px-3.5 sm:text-sm text-foreground transition-[transform,background-color] duration-150 ease-out hover:bg-muted active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"

/** Signed-in generator: prompt composer, canvas, and result actions. */
export default function Studio() {
  const reduce = useReducedMotion()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [lastPrompt, setLastPrompt] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isMockupOpen, setIsMockupOpen] = useState(false)
  const [style, setStyle] = useState<StyleId | null>(null)
  const [limit, setLimit] = useState<{ code: Exclude<LimitCode, "PAID_GLOBAL_LIMIT">; message: string; resetTime: string | null } | null>(null)
  const { entitlements, setEntitlements, refresh } = useEntitlements(true)
  const [isMac, setIsMac] = useState(false)
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), [])
  const stageRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  usePaymentReturn(true, refresh, () => setLimit(null))

  // On small screens the canvas sits below the composer; bring it into view once generation starts.
  useEffect(() => {
    if (!isGenerating || !window.matchMedia("(max-width: 1023px)").matches) return
    const id = requestAnimationFrame(() =>
      stageRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
    )
    return () => cancelAnimationFrame(id)
  }, [isGenerating, reduce])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { prompt: "", negativePrompt: DEFAULT_NEGATIVE_PROMPT },
  })
  const promptValue = watch("prompt") ?? ""

  const onSubmit = async (data: FormValues) => {
    try {
      setIsGenerating(true)
      setError(null)
      setLimit(null)
      const suffix = STYLE_PRESETS.find((s) => s.id === style)?.suffix
      const prompt = suffix ? `${data.prompt.trim()}, ${suffix}` : data.prompt

      const response = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, negative_prompt: data.negativePrompt, size: "desktop" }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (errorData.entitlements) setEntitlements(errorData.entitlements)
        if (response.status === 429 && errorData.code && errorData.code !== "PAID_GLOBAL_LIMIT") {
          setLimit({ code: errorData.code, message: errorData.message, resetTime: errorData.resetTime ?? null })
          return
        }
        throw new Error(errorData.message || errorData.error || "Failed to generate image")
      }

      const result = await response.json()
      if (result.entitlements) setEntitlements(result.entitlements)
      setGeneratedImage(result.image)
      setLastPrompt(data.prompt.trim())
    } catch (err) {
      console.error("Generation failed:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    fetch(generatedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `wallpaperz-ai-${Date.now()}.png`
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

  const handleShare = async () => {
    if (!generatedImage) return
    try {
      if (navigator.share) {
        const blob = await fetch(generatedImage).then((r) => r.blob())
        const file = new File([blob], "wallpaper.png", { type: "image/png" })
        await navigator.share({
          title: "My AI-generated wallpaper",
          text: "Check out this wallpaper I created with AI!",
          files: [file],
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (err) {
      console.error("Sharing failed:", err)
    }
  }

  const handleReset = () => {
    setGeneratedImage(null)
    setError(null)
  }

  const surprise = () => {
    const pick = PROMPT_EXAMPLES[Math.floor(Math.random() * PROMPT_EXAMPLES.length)]
    setValue("prompt", pick.prompt, { shouldValidate: true })
  }

  const applyExample = (prompt: string) => {
    setValue("prompt", prompt, { shouldValidate: true })
    document.getElementById("prompt")?.focus({ preventScroll: true })
    if (window.matchMedia("(max-width: 1023px)").matches) {
      formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
    }
  }

  // Cmd/Ctrl+Enter submits from anywhere in the composer.
  const onComposerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !isGenerating) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  const promptField = register("prompt", { required: "Describe the wallpaper you want first." })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Library
      </Link>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">Create a wallpaper</h1>
        <UsageBar entitlements={entitlements} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
        {/* Composer */}
        <div className="order-1 space-y-8 lg:order-none lg:col-span-5 lg:row-start-1">
          {limit && <UpsellCard code={limit.code} message={limit.message} resetTime={limit.resetTime} onDismiss={() => setLimit(null)} />}

          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} onKeyDown={onComposerKeyDown} className="scroll-mt-24 space-y-6">
            <div>
              <label htmlFor="prompt" className="text-sm font-medium text-foreground">
                Describe your wallpaper
              </label>
              <div
                className={cn(
                  "mt-2 rounded-xl border bg-card shadow-[0_1px_2px_rgba(30,20,60,0.04)] transition-[border-color,box-shadow] duration-150 focus-within:border-violet-500/60 focus-within:ring-4 focus-within:ring-violet-500/10",
                  errors.prompt ? "border-destructive/60" : "border-border"
                )}
              >
                <textarea
                  id="prompt"
                  {...promptField}
                  maxLength={MAX_PROMPT}
                  rows={5}
                  disabled={isGenerating}
                  aria-invalid={!!errors.prompt}
                  aria-describedby={errors.prompt ? "prompt-error" : undefined}
                  placeholder="A quiet harbor town at blue hour, lights reflecting on the water, soft fog rolling in"
                  className="block w-full resize-none bg-transparent px-4 pb-2 pt-3.5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/80 focus:outline-none disabled:opacity-60 sm:text-[15px]"
                />
                <div className="flex items-center justify-between gap-3 px-2.5 pb-2.5">
                  <button
                    type="button"
                    onClick={surprise}
                    disabled={isGenerating}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    <Shuffle className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Surprise me
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="hidden font-mono text-xs tabular-nums text-muted-foreground sm:inline">
                      {promptValue.length}/{MAX_PROMPT}
                    </span>
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="group inline-flex h-9 items-center gap-2 rounded-lg bg-foreground pl-3.5 pr-3 text-sm font-medium text-background transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      {isGenerating ? "Generating" : "Generate"}
                      {!isGenerating && <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" strokeWidth={1.75} />}
                    </button>
                  </div>
                </div>
              </div>
              {errors.prompt ? (
                <p id="prompt-error" className="mt-2 text-sm text-destructive">{errors.prompt.message}</p>
              ) : (
                <p className="mt-2 hidden text-xs text-muted-foreground lg:block">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">{isMac ? "⌘" : "Ctrl"}</kbd>
                  {" + "}
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">Enter</kbd>
                  {" to generate"}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="flex w-full items-baseline justify-between text-sm font-medium text-foreground">
                Style
                <span className="text-xs font-normal text-muted-foreground">Optional</span>
              </legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {STYLE_PRESETS.map((s) => {
                  const active = style === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setStyle(active ? null : s.id)}
                      className={cn(
                        "h-8 rounded-lg border px-3 text-[13px] transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60",
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      )}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
              <p className="mt-2.5 text-xs text-muted-foreground">Output is 1344 × 768 (16:9), sized for laptops and desktops.</p>
            </fieldset>

            <details className="group border-t border-border/70 pt-4">
              <summary className="flex list-none items-center justify-between text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                What to avoid
                <span className="text-xs font-normal text-muted-foreground group-open:hidden">Optional</span>
              </summary>
              <div className="mt-3">
                <textarea
                  id="negativePrompt"
                  aria-label="What to avoid"
                  rows={2}
                  maxLength={MAX_PROMPT}
                  placeholder="Low quality, blurry, distorted"
                  className="block w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/80 focus:border-violet-500/60 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                  {...register("negativePrompt")}
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Things you don&apos;t want in the image.</p>
                  <button
                    type="button"
                    onClick={() => setValue("negativePrompt", DEFAULT_NEGATIVE_PROMPT)}
                    className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Reset to default
                  </button>
                </div>
              </div>
            </details>
          </form>
        </div>

        <section aria-labelledby="examples-heading" className="order-3 border-t border-border/70 pt-6 lg:order-none lg:col-span-5 lg:row-start-2">
            <h2 id="examples-heading" className="text-sm font-medium text-foreground">Start from an example</h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {PROMPT_EXAMPLES.map((ex) => (
                <li key={ex.file}>
                  <button
                    type="button"
                    onClick={() => applyExample(ex.prompt)}
                    disabled={isGenerating}
                    title={ex.prompt}
                    className="group block w-full text-left transition-transform duration-150 ease-out active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none"
                  >
                    <span className="block aspect-[16/10] overflow-hidden rounded-lg bg-muted ring-1 ring-black/5 group-focus-visible:ring-2 group-focus-visible:ring-violet-500 dark:ring-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element -- ImageKit-sized */}
                      <img
                        src={libraryImage(ex.file, 400)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="mt-1.5 block truncate text-xs text-muted-foreground group-hover:text-foreground">{ex.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

        {/* Canvas */}
        <div ref={stageRef} className="order-2 scroll-mt-24 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            {error && (
              <div role="alert" className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/[0.04] px-4 py-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">That didn&apos;t work</p>
                  <p className="mt-0.5 text-muted-foreground">{error}. Your prompt is still here, so you can try again.</p>
                </div>
                <button type="button" onClick={() => setError(null)} aria-label="Dismiss error" className="rounded-md p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            )}

            <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f4f3f8] ring-1 ring-black/[0.06] dark:bg-white/[0.03] dark:ring-white/10">
              <AnimatePresence mode="wait" initial={false}>
                {isGenerating ? (
                  <motion.div key="gen" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <NoiseField />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <GeneratingSteps />
                    </div>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.button
                    key="img"
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    aria-label="Open full-size preview"
                    className="group absolute inset-0 block focus-visible:outline-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- data: URL from the API */}
                    <img src={generatedImage} alt={lastPrompt ? `AI wallpaper: ${lastPrompt}` : "Generated wallpaper"} className="h-full w-full object-cover motion-safe:animate-diffuse-in" />
                    <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Expand className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                  </motion.button>
                ) : (
                  <motion.div key="empty" className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] p-6 [background-size:20px_20px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div className="max-w-sm text-center">
                      <p className="text-base font-medium text-foreground">Your wallpaper appears here</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        Name a place, the light, and a mood. It takes about 15 seconds.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {generatedImage && !isGenerating ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.15 }}
                className="mt-5"
              >
                {lastPrompt && <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{lastPrompt}</p>}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Download className="h-4 w-4" strokeWidth={1.75} />
                    Download
                  </button>
                  <div className="grid grid-cols-3 gap-2 sm:flex">
                    <button type="button" onClick={() => setIsPreviewOpen(true)} className={ghostBtn}>
                      <Expand className="h-4 w-4" strokeWidth={1.75} />
                      Preview
                    </button>
                    <button type="button" onClick={() => setIsMockupOpen(true)} className={ghostBtn}>
                      <MonitorSmartphone className="h-4 w-4" strokeWidth={1.75} />
                      <span className="sm:hidden">On screen</span>
                      <span className="hidden sm:inline">Try on screen</span>
                    </button>
                    <button type="button" onClick={handleShare} className={ghostBtn}>
                      <Share2 className="h-4 w-4" strokeWidth={1.75} />
                      Share
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:ml-auto"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                    New image
                  </button>
                </div>
                <AiDisclosure className="mt-5 border-t border-border/70 pt-4" />
              </motion.div>
            ) : (
              !isGenerating && (
                <ul className="mt-5 grid gap-x-8 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <li>Be specific about light, color and atmosphere.</li>
                  <li>Name a medium: photo, film still, oil painting.</li>
                  <li>Say where the eye should land, and what stays empty.</li>
                  <li>Pick a style above instead of stacking keywords.</li>
                </ul>
              )
            )}
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0a10]/95 p-4 backdrop-blur-sm"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="relative max-h-[90vh] max-w-[95vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={generatedImage} alt="Generated wallpaper preview" className="max-h-[85vh] max-w-full rounded-lg object-contain" />
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  aria-label="Download"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm transition-[transform,background-color] duration-150 hover:bg-black/70 active:scale-[0.95]"
                >
                  <Download className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  aria-label="Close preview"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm transition-[transform,background-color] duration-150 hover:bg-black/70 active:scale-[0.95]"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
