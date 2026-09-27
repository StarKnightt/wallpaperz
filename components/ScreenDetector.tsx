"use client"

import { useState } from "react"
import Link from "next/link"
import { ScanLine } from "lucide-react"
import { DEVICES, Device } from "@/lib/devices"

type Result = { w: number; h: number; matches: Device[]; closest: Device | null }

function detect(): Result {
  const dpr = window.devicePixelRatio || 1
  let w = Math.round(window.screen.width * dpr)
  let h = Math.round(window.screen.height * dpr)
  // Phones report portrait, desktops landscape; normalise to how the device is used
  const touch = window.matchMedia("(pointer: coarse)").matches
  const small = Math.min(window.screen.width, window.screen.height) < 600
  if (touch && small && w > h) [w, h] = [h, w]
  if (!(touch && small) && h > w) [w, h] = [h, w]

  const near = (a: number, b: number) => Math.abs(a - b) <= 4
  const matches = DEVICES.filter((d) => near(d.width, w) && near(d.height, h))
  const sameOrientation = DEVICES.filter((d) => d.height > d.width === h > w)
  const closest = matches.length
    ? null
    : sameOrientation.reduce<Device | null>((best, d) => {
        const score = Math.abs(d.width / d.height - w / h) * 4 + Math.abs(d.width * d.height - w * h) / (w * h)
        const bestScore = best ? Math.abs(best.width / best.height - w / h) * 4 + Math.abs(best.width * best.height - w * h) / (w * h) : Infinity
        return score < bestScore ? d : best
      }, null)
  return { w, h, matches, closest }
}

export default function ScreenDetector() {
  const [result, setResult] = useState<Result | null>(null)

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6">
      {!result ? (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Not sure which model you have?</p>
            <p className="text-sm text-muted-foreground">We can read your screen&apos;s resolution and take you to the right size.</p>
          </div>
          <button
            type="button"
            onClick={() => setResult(detect())}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ScanLine className="h-4 w-4" />
            Detect my screen
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">Your screen</p>
          <p className="text-2xl font-bold tabular-nums">{result.w} × {result.h} px</p>
          {result.matches.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">That&apos;s the exact panel of:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.matches.map((d) => (
                  <Link key={d.slug} href={`/devices/${d.slug}`} className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                    {d.name} wallpapers &rarr;
                  </Link>
                ))}
              </div>
            </div>
          ) : result.closest ? (
            <p className="mt-3 text-sm">
              No exact match in our list - the closest shape is{" "}
              <Link href={`/devices/${result.closest.slug}`} className="font-medium text-primary hover:underline">
                {result.closest.name} ({result.closest.width}×{result.closest.height})
              </Link>
              .
            </p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            Browsers can report a scaled resolution when display zoom is on, so double-check against the list below.
          </p>
        </div>
      )}
    </div>
  )
}
