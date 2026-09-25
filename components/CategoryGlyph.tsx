import type { ReactNode } from "react"

/**
 * Small hand-drawn, animated SVG per category. Animations live in globals.css
 * (.glyph-*) and are disabled under prefers-reduced-motion.
 */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }

const GLYPHS: Record<string, { color: string; svg: ReactNode }> = {
  abstract: {
    color: "#a855f7",
    svg: (
      <g className="glyph-spin-slow">
        <circle cx="19" cy="20" r="9" fill="#a855f7" opacity="0.55" />
        <circle cx="29" cy="20" r="9" fill="#ec4899" opacity="0.55" />
        <circle cx="24" cy="29" r="9" fill="#3b82f6" opacity="0.55" />
      </g>
    ),
  },
  anime: {
    color: "#f43f5e",
    svg: (
      <>
        <path {...S} d="M8 15c5 1.5 27 1.5 32 0M11 21h26M15 16v24M33 16v24M22 21v-4M26 21v-4" />
        <path className="glyph-petal" d="M36 6c2 0 3 2 2 3.5S34.5 11 34 9.5 34.5 6 36 6Z" fill="#fb7185" />
        <path className="glyph-petal glyph-delay-2" d="M13 4c2 0 3 2 2 3.5S11.5 9 11 7.5 11.5 4 13 4Z" fill="#fda4af" />
      </>
    ),
  },
  art: {
    color: "#f97316",
    svg: (
      <>
        <path className="glyph-draw" d="M7 33c6-10 11 4 17-6s10 2 17-8" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
        <path {...S} d="M30 40l10-10 3 3-10 10h-3v-3Z" />
      </>
    ),
  },
  cars: {
    color: "#ef4444",
    svg: (
      <>
        <g className="glyph-car-bob">
          <path {...S} d="M7 28l3-7c1-2 2-3 4-3h14c2 0 3 1 5 3l4 4h3c1.5 0 2 1 2 2v3H7v-2Z" />
          <circle cx="15" cy="31" r="3" fill="currentColor" />
          <circle cx="33" cy="31" r="3" fill="currentColor" />
        </g>
        <g className="glyph-road">
          <path d="M2 39h8M18 39h8M34 39h8M50 39h8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </>
    ),
  },
  city: {
    color: "#3b82f6",
    svg: (
      <>
        <path {...S} d="M5 41h38M8 41V22h9v19M17 41V11h11v30M28 41V18h10v23" />
        {[
          [11, 26, 0], [13.5, 32, 3], [20, 15, 1], [24, 21, 4], [20, 27, 2], [24, 33, 5], [31, 23, 3], [34.5, 29, 0], [31, 35, 1],
        ].map(([x, y, d]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="2.5" height="2.5" rx="0.5" fill="#facc15" className={`glyph-window glyph-delay-${d}`} />
        ))}
      </>
    ),
  },
  fantasy: {
    color: "#8b5cf6",
    svg: (
      <>
        <path className="glyph-twinkle" d="M24 6l3 12 12 3-12 3-3 12-3-12-12-3 12-3 3-12Z" fill="#8b5cf6" />
        <path className="glyph-twinkle glyph-delay-2" d="M38 30l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5 1.5-5Z" fill="#c4b5fd" />
        <path className="glyph-twinkle glyph-delay-4" d="M10 32l1 3.5 3.5 1-3.5 1-1 3.5-1-3.5-3.5-1 3.5-1 1-3.5Z" fill="#a78bfa" />
      </>
    ),
  },
  gaming: {
    color: "#22c55e",
    svg: (
      <g className="glyph-invader">
        <path
          fill="#22c55e"
          d="M14 12h4v4h-4zM30 12h4v4h-4zM18 16h12v4H18zM14 20h20v4H14zM10 24h8v4h-8zM22 24h4v4h-4zM30 24h8v4h-8zM10 28h28v4H10zM10 32h4v4h-4zM34 32h4v4h-4zM18 36h4v4h-4zM26 36h4v4h-4z"
        />
      </g>
    ),
  },
  nature: {
    color: "#16a34a",
    svg: (
      <>
        <circle className="glyph-sun" cx="33" cy="15" r="5" fill="#fbbf24" />
        <path d="M3 40l13-18 8 10 6-7 15 15H3Z" fill="#16a34a" opacity="0.85" />
        <path d="M16 22l4 5-4-1-3 2 3-6Z" fill="white" opacity="0.8" />
      </>
    ),
  },
  people: {
    color: "#ec4899",
    svg: (
      <>
        <circle {...S} cx="24" cy="19" r="6" />
        <path {...S} d="M13 38c1.5-7 6-10 11-10s9.5 3 11 10" />
        <g className="glyph-focus" stroke="#ec4899" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M6 13V6h7M35 6h7v7M42 35v7h-7M13 42H6v-7" />
        </g>
      </>
    ),
  },
  space: {
    color: "#6366f1",
    svg: (
      <>
        <circle cx="24" cy="24" r="8" fill="#6366f1" />
        <ellipse {...S} cx="24" cy="24" rx="16" ry="5" transform="rotate(-20 24 24)" />
        <g className="glyph-orbit">
          <circle cx="24" cy="5" r="2.5" fill="#fbbf24" />
        </g>
      </>
    ),
  },
  technology: {
    color: "#06b6d4",
    svg: (
      <>
        <path {...S} d="M6 14h10l6 6h20M6 34h14l6-6h16M24 6v8M24 34v8" />
        <rect x="18" y="18" width="12" height="12" rx="2" fill="#06b6d4" />
        <path className="glyph-pulse" d="M6 14h10l6 6h20" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" pathLength={100} />
        <path className="glyph-pulse glyph-delay-3" d="M6 34h14l6-6h16" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" pathLength={100} />
      </>
    ),
  },
  minimalist: {
    color: "#64748b",
    svg: (
      <>
        <path d="M6 32h36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <circle className="glyph-slide" cx="12" cy="24" r="6" fill="#64748b" />
      </>
    ),
  },
  mobile: {
    color: "#0ea5e9",
    svg: (
      <>
        <rect {...S} x="14" y="4" width="20" height="40" rx="4" />
        <rect x="17" y="8" width="14" height="30" rx="1.5" className="glyph-screen" />
        <circle className="glyph-ping" cx="31" cy="9" r="2.5" fill="#f43f5e" />
      </>
    ),
  },
}

export default function CategoryGlyph({ slug }: { slug: string }) {
  const glyph = GLYPHS[slug]
  if (!glyph) return null
  return (
    <span
      className="glyph grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
      style={{ backgroundColor: `${glyph.color}1f`, color: glyph.color }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-8 w-8 overflow-visible">
        {glyph.svg}
      </svg>
    </span>
  )
}
