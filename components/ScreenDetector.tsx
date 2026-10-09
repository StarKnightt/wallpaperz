"use client"

import { useState } from "react"
import Link from "next/link"
import { ScanLine } from "lucide-react"
import { detectScreen, type ScreenResult } from "@/lib/screen"

export default function ScreenDetector() {
  const [result, setResult] = useState<ScreenResult | null>(null)

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
            onClick={() => setResult(detectScreen())}
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
