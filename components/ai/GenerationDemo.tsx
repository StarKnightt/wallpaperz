"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles } from "lucide-react"
import NoiseField from "@/components/ai/NoiseField"

const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || "https://ik.imagekit.io/starknight"
const img = (file: string) => `${IK}/wallpapers/${file}?tr=w-1100,q-75,f-auto`

const EXAMPLES = [
  { prompt: "Retro synthwave supercar racing into a neon sunset, chrome grid road", src: img("synthwave-outrun-supercar-sunset-2k-wallpaperz.jpg") },
  { prompt: "Aurora borealis over snowy mountains reflected in a still lake", src: img("aurora-borealis-mountain-lake-2k-wallpaperz.jpg") },
  { prompt: "Floating castle above the clouds at dawn, waterfalls, epic fantasy", src: img("fantasy-floating-castle-dawn-2k-wallpaperz.jpg") },
  { prompt: "Sunken city on the ocean floor, a giant whale in god rays", src: img("sunken-city-whale-godrays-2k-wallpaperz.jpg") },
  { prompt: "Zen garden with crimson maples in morning mist", src: img("zen-garden-crimson-maple-mist-2k-wallpaperz.jpg") },
]

type Phase = "typing" | "noise" | "reveal" | "hold"
const STEPS = ["Reading your prompt", "Composing the scene", "Adding light", "Sharpening details"]

/** Self-playing prompt → noise → wallpaper loop built from real library images. */
export default function GenerationDemo() {
  const [i, setI] = useState(0)
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState<Phase>("typing")
  const [step, setStep] = useState(0)
  const [reduced, setReduced] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const visible = useRef(true)

  const ex = EXAMPLES[i]

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
      if (typed < ex.prompt.length) wait(typed === 0 ? 500 : 28 + Math.random() * 30, () => setTyped((n) => n + 1))
      else wait(450, () => { setStep(0); setPhase("noise") })
    } else if (phase === "noise") {
      if (step < STEPS.length - 1) wait(520, () => setStep((s) => s + 1))
      else wait(520, () => setPhase("reveal"))
    } else if (phase === "reveal") {
      wait(1300, () => setPhase("hold"))
    } else {
      wait(2600, () => { setI((n) => (n + 1) % EXAMPLES.length); setTyped(0); setPhase("typing") })
    }
    return () => clearTimeout(t)
  }, [phase, typed, step, ex.prompt.length, reduced])

  const showImage = phase === "reveal" || phase === "hold"

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-3xl" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-amber-400/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-left">
          <Sparkles className="h-4 w-4 shrink-0 text-fuchsia-400" />
          <p className="min-h-[1.25rem] flex-1 truncate font-mono text-[13px] text-white/90 sm:text-sm">
            {ex.prompt.slice(0, typed)}
            <span className={`ml-px inline-block h-4 w-[2px] translate-y-[3px] bg-fuchsia-400 ${phase === "typing" ? "motion-safe:animate-pulse" : "opacity-0"}`} />
          </p>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              phase === "noise" ? "bg-fuchsia-500 text-white" : "bg-white/10 text-white/60"
            }`}
          >
            {phase === "noise" ? "Generating" : showImage ? "Done" : "Generate"}
          </span>
        </div>

        <div className="relative aspect-[16/9]">
          {phase === "typing" && (
            // eslint-disable-next-line @next/next/no-img-element -- decorative, already preloaded
            <img
              src={EXAMPLES[(i + EXAMPLES.length - 1) % EXAMPLES.length].src}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl transition-opacity duration-700"
            />
          )}
          {phase === "noise" && <NoiseField />}
          {showImage && (
            // eslint-disable-next-line @next/next/no-img-element -- demo image pre-sized via ImageKit
            <img key={i} src={ex.src} alt="" className="absolute inset-0 h-full w-full object-cover motion-safe:animate-diffuse-in" />
          )}
          {phase === "noise" && (
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="mb-2 text-xs font-medium text-white/85">{STEPS[step]}…</div>
              <div className="h-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 transition-[width] duration-500 ease-out" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {EXAMPLES.map((_, n) => (
          <span key={n} className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? "w-6 bg-fuchsia-400" : "w-1.5 bg-white/25"}`} />
        ))}
      </div>
    </div>
  )
}
