/**
 * Stand-in for an image that is still being generated: two slow, soft pools of
 * color under drifting film grain, like a diffusion model before it resolves.
 */
export default function NoiseField({ className = "", intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#0d0b14] ${className}`} aria-hidden="true">
      <div className="absolute -left-[15%] top-[-25%] h-[90%] w-[70%] rounded-full bg-[#6d4bd8] opacity-50 blur-[80px] motion-safe:animate-[wz-drift-a_14s_ease-in-out_infinite_alternate]" />
      <div className="absolute -right-[10%] bottom-[-30%] h-[85%] w-[60%] rounded-full bg-[#c9795a] opacity-35 blur-[90px] motion-safe:animate-[wz-drift-b_17s_ease-in-out_infinite_alternate]" />
      <svg className="absolute inset-0 h-full w-full mix-blend-overlay" style={{ opacity: 0.35 + 0.35 * intensity }}>
        <filter id="wz-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" stitchTiles="stitch">
            <animate attributeName="seed" values="1;2;3;4;5;6" dur="1.2s" repeatCount="indefinite" calcMode="discrete" />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wz-grain)" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5))]" />
    </div>
  )
}
