"use client"

import { useEffect, useState, type ReactNode } from "react"

/** Phone lock-screen clock. Renders Apple's "9:41" on the server, real time after mount. */
export function LockClock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  const time = now
    ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M$/i, "")
    : "9:41"
  const date = now
    ? now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
    : "Tuesday, September 9"

  return (
    <div className={`text-center text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] ${className}`}>
      <div className="text-[0.62em] font-medium opacity-90">{date}</div>
      <div className="text-[3.1em] font-semibold leading-none tracking-tight tabular-nums">{time}</div>
    </div>
  )
}

/** iOS-style lock screen chrome: status bar, clock, torch/camera, home bar. */
export function LockScreenChrome({ size = 16 }: { size?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col" style={{ fontSize: size }}>
      <div className="flex items-center justify-between px-[1.4em] pt-[0.9em] text-[0.6em] font-semibold text-white">
        <span className="opacity-0">9:41</span>
        <svg viewBox="0 0 34 12" className="h-[0.8em] w-auto" aria-hidden="true">
          <rect x="0" y="7" width="3" height="5" rx="1" fill="white" />
          <rect x="5" y="5" width="3" height="7" rx="1" fill="white" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="white" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="white" opacity="0.4" />
          <rect x="21" y="1" width="11" height="10" rx="2.5" fill="none" stroke="white" strokeWidth="1.2" />
          <rect x="22.6" y="2.6" width="6.5" height="6.8" rx="1.2" fill="white" />
          <rect x="32.5" y="4" width="1.3" height="4" rx="0.6" fill="white" opacity="0.6" />
        </svg>
      </div>
      <LockClock className="mt-[1.6em]" />
      <div className="mt-auto flex items-end justify-between px-[1.6em] pb-[1.1em]">
        <span className="grid h-[2.3em] w-[2.3em] place-items-center rounded-full bg-black/35 backdrop-blur-md">
          <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em]" aria-hidden="true">
            <path d="M8 2h8l-1 6H9L8 2Zm1 7h6v12a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V9Z" fill="white" />
          </svg>
        </span>
        <span className="mb-[0.1em] h-[0.3em] w-[7em] rounded-full bg-white/90" />
        <span className="grid h-[2.3em] w-[2.3em] place-items-center rounded-full bg-black/35 backdrop-blur-md">
          <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em]" aria-hidden="true">
            <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" fill="none" stroke="white" strokeWidth="1.8" />
            <circle cx="12" cy="13.5" r="3.5" fill="none" stroke="white" strokeWidth="1.8" />
          </svg>
        </span>
      </div>
    </div>
  )
}

/** macOS-style desktop chrome: menu bar and dock. */
export function DesktopChrome({ size = 12 }: { size?: number }) {
  const dock = ["#3b82f6", "#f97316", "#22c55e", "#a855f7", "#ec4899", "#eab308"]
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col" style={{ fontSize: size }}>
      <div className="flex h-[1.7em] items-center gap-[1.2em] bg-black/25 px-[0.9em] text-[0.75em] font-medium text-white backdrop-blur-md">
        <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em]" aria-hidden="true">
          <path d="M12 3 3 9v12h6v-7h6v7h6V9l-9-6Z" fill="white" />
        </svg>
        <span className="font-semibold">Wallpaperz</span>
        <span className="opacity-80">File</span>
        <span className="opacity-80">View</span>
        <LockClockInline className="ml-auto opacity-90" />
      </div>
      <div className="mx-auto mb-[0.6em] mt-auto flex gap-[0.45em] rounded-[1em] border border-white/20 bg-white/15 p-[0.4em] backdrop-blur-xl">
        {dock.map((c) => (
          <span key={c} className="h-[2.2em] w-[2.2em] rounded-[0.6em] shadow-inner" style={{ background: `linear-gradient(145deg, ${c}, ${c}99)` }} />
        ))}
      </div>
    </div>
  )
}

function LockClockInline({ className = "" }: { className?: string }) {
  const [label, setLabel] = useState("Tue 9:41")
  useEffect(() => {
    const tick = () =>
      setLabel(new Date().toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  return <span className={`tabular-nums ${className}`}>{label}</span>
}

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[9/19.5] rounded-[16%/7.4%] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[3.2%] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/15 ${className}`}>
      <span className="absolute -left-[1.5%] top-[18%] h-[6%] w-[1.5%] rounded-l bg-neutral-600" />
      <span className="absolute -left-[1.5%] top-[27%] h-[9%] w-[1.5%] rounded-l bg-neutral-600" />
      <span className="absolute -right-[1.5%] top-[24%] h-[12%] w-[1.5%] rounded-r bg-neutral-600" />
      <div className="relative h-full w-full overflow-hidden rounded-[13%/6%] bg-black">
        {children}
        <span className="absolute left-1/2 top-[1.6%] h-[3.6%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}

export function LaptopFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-t-[3.5%/5.5%] bg-neutral-900 p-[2.2%] pb-[3%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/15">
        <span className="absolute left-1/2 top-[1%] h-[1.1%] w-[1.1%] min-h-[3px] min-w-[3px] -translate-x-1/2 rounded-full bg-neutral-700" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.6%] bg-black">{children}</div>
      </div>
      <svg viewBox="0 0 400 14" className="block w-[114%] -ml-[7%] h-auto" aria-hidden="true">
        <defs>
          <linearGradient id="laptop-base" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d4d4d8" />
            <stop offset="0.5" stopColor="#71717a" />
            <stop offset="1" stopColor="#27272a" />
          </linearGradient>
        </defs>
        <path d="M0 0h400v5c0 5-8 9-20 9H20C8 14 0 10 0 5V0Z" fill="url(#laptop-base)" />
        <rect x="165" y="0" width="70" height="4" rx="2" fill="#52525b" />
      </svg>
    </div>
  )
}

/**
 * Wallpaper screen that swaps images with a swipe-up reveal. Only the outgoing
 * and incoming images are mounted; the next one is preloaded ahead of time.
 */
export function CyclingScreen({
  srcs,
  interval = 4500,
  offset = 0,
}: {
  srcs: string[]
  interval?: number
  offset?: number
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (srcs.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let intervalId: ReturnType<typeof setInterval> | undefined
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (!document.hidden) setIndex((i) => (i + 1) % srcs.length)
      }, interval)
    }, offset)
    return () => {
      clearTimeout(startId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [srcs.length, interval, offset])

  useEffect(() => {
    const next = new window.Image()
    next.src = srcs[(index + 1) % srcs.length]
  }, [index, srcs])

  const prev = (index - 1 + srcs.length) % srcs.length
  return (
    <>
      {index !== prev && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative, pre-sized via ImageKit
        <img src={srcs[prev]} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative, pre-sized via ImageKit */}
      <img
        key={index}
        src={srcs[index]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover motion-safe:animate-screen-reveal"
        draggable={false}
      />
    </>
  )
}
