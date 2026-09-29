"use client"

import { useEffect, useState } from "react"

const GEN_STEPS = ["Reading your prompt", "Composing the scene", "Adding light and color", "Sharpening details", "Almost there"]

/** Honest-ish progress: steps advance on a timer and hold on the last one until the API returns. */
export default function GeneratingSteps() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 200)
    return () => clearInterval(id)
  }, [])
  const step = Math.min(GEN_STEPS.length - 1, Math.floor(elapsed / 3.5))
  const pct = Math.min(95, (elapsed / 18) * 100)

  return (
    <div role="status" aria-live="polite">
      <div className="mb-3 flex items-baseline justify-between gap-4 text-[13px] text-white/90">
        <span key={step} className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">{GEN_STEPS[step]}</span>
        <span className="font-mono text-xs tabular-nums text-white/60">{elapsed.toFixed(0)}s</span>
      </div>
      <div className="h-[2px] overflow-hidden bg-white/15">
        <div
          className="h-full origin-left bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 transition-transform duration-200 ease-linear"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
    </div>
  )
}
