"use client"

import { useEffect, useRef, useState } from "react"
import NoiseField from "@/components/ai/NoiseField"
import { libraryImage } from "@/components/ai/examples"

const EXAMPLES = [
  { prompt: "Aurora borealis over snowy mountains, reflected in a still lake", file: "aurora-borealis-mountain-lake-2k-wallpaperz.jpg" },
  { prompt: "Floating castle above the clouds at dawn, waterfalls, soft gold light", file: "fantasy-floating-castle-dawn-2k-wallpaperz.jpg" },
  { prompt: "Sunken city on the ocean floor, a giant whale in god rays", file: "sunken-city-whale-godrays-2k-wallpaperz.jpg" },
  { prompt: "Zen garden with crimson maples in morning mist", file: "zen-garden-crimson-maple-mist-2k-wallpaperz.jpg" },
  { prompt: "Retro synthwave supercar racing into a neon sunset", file: "synthwave-outrun-supercar-sunset-2k-wallpaperz.jpg" },
].map((e) => ({ ...e, src: libraryImage(e.file, 1200, 80) }))

type Phase = "typing" | "noise" | "reveal" | "hold"
const STEPS = ["Reading your prompt", "Composing the scene", "Adding light", "Sharpening details"]

/** Self-playing prompt → noise → wallpaper loop built from real library images. */
export default function GenerationDemo() {
  const [i, setI] = useState(0)
  // Opens on a finished wallpaper so the first paint is a real image, then starts the loop.
  const [typed, setTyped] = useState(EXAMPLES[0].prompt.length)
  const [phase, setPhase] = useState<Phase>("hold")
  const [step, setStep] = useState(0)
  const [reduced, setReduced] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const visible = useRef(true)

  const ex = EXAMPLES[i]
  const prev = EXAMPLES[(i + EXAMPLES.length - 1) % EXAMPLES.length]

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting })
    if (rootRef.current) io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    EXAMPLES.forEach((e) => { const im = new window.Image(); im.src = e.src })
  }, [])

  useEffect(() => {
    if (reduced) { setTyped(ex.prompt.length); setPhase("hold"); return }
    let t: ReturnType<typeof setTimeout>
    const wait = (ms: number, fn: () => void) => {
      t = setTimeout(() => (visible.current && !document.hidden ? fn() : wait(500, fn)), ms)
    }
    if (phase === "typing") {
      if (typed < ex.prompt.length) wait(typed === 0 ? 600 : 26 + Math.random() * 28, () => setTyped((n) => n + 1))
      else wait(500, () => { setStep(0); setPhase("noise") })
    } else if (phase === "noise") {
      if (step < STEPS.length - 1) wait(560, () => setStep((s) => s + 1))
      else wait(560, () => setPhase("reveal"))
    } else if (phase === "reveal") {
      wait(1300, () => setPhase("hold"))
    } else {
      wait(3200, () => { setI((n) => (n + 1) % EXAMPLES.length); setTyped(0); setPhase("typing") })
    }
    return () => clearTimeout(t)
  }, [phase, typed, step, ex.prompt.length, reduced])

  const showImage = phase === "reveal" || phase === "hold"

  return (
    <div ref={rootRef} className="relative w-full" aria-hidden="true">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#0d0b14] shadow-[0_30px_60px_-30px_rgba(40,20,80,0.45)] ring-1 ring-black/5 dark:ring-white/10 sm:aspect-[16/9]">
        {/* eslint-disable-next-line @next/next/no-img-element -- previous result stays as a dim backdrop while the next prompt types */}
        <img
          src={prev.src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-700 ${phase === "typing" ? "opacity-40 blur-md" : "opacity-0"}`}
        />
        {phase === "noise" && <NoiseField />}
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element -- demo image pre-sized via ImageKit
          <img key={i} src={ex.src} alt="" className={`absolute inset-0 h-full w-full object-cover ${phase === "reveal" ? "motion-safe:animate-diffuse-in" : ""}`} />
        )}
        {phase === "noise" && (
          <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between px-5 pb-16 text-[13px] text-white/85 sm:pb-20">
            <span key={step} className="motion-safe:animate-in motion-safe:fade-in">{STEPS[step]}</span>
          </div>
        )}
      </div>

      <div className="relative mx-3 -mt-10 flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white/95 px-4 py-3 shadow-[0_8px_24px_-12px_rgba(40,20,80,0.25)] backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/90 sm:mx-6 sm:-mt-12 sm:px-5 sm:py-3.5">
        <p className="min-h-[1.25rem] min-w-0 flex-1 truncate text-sm text-foreground">
          {ex.prompt.slice(0, typed)}
          <span className={`ml-px inline-block h-4 w-px translate-y-[3px] bg-foreground ${phase === "typing" ? "motion-safe:animate-pulse" : "opacity-0"}`} />
        </p>
        <span
          className={`inline-flex h-8 shrink-0 items-center rounded-lg px-3 text-xs font-medium transition-colors duration-200 ${
            phase === "noise"
              ? "bg-muted text-muted-foreground"
              : "bg-foreground text-background"
          }`}
        >
          {phase === "noise" ? "Generating" : showImage ? "Done" : "Generate"}
        </span>
      </div>
    </div>
  )
}
