/**
 * Animated SVG "diffusion noise": turbulence tinted with a slowly shifting
 * gradient. Stands in for an image that is still being generated.
 */
export default function NoiseField({ className = "", intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#0b0718] ${className}`} aria-hidden="true">
      <div className="absolute -inset-1/2 bg-[conic-gradient(from_0deg,#7c3aed,#db2777,#f59e0b,#0ea5e9,#7c3aed)] opacity-60 blur-3xl motion-safe:animate-[spin_12s_linear_infinite]" />
      <svg className="absolute inset-0 h-full w-full mix-blend-overlay" style={{ opacity: 0.55 + 0.35 * intensity }}>
        <filter id="wz-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" stitchTiles="stitch">
            <animate attributeName="seed" values="1;2;3;4;5;6;7;8" dur="0.8s" repeatCount="indefinite" calcMode="discrete" />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wz-noise)" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55))]" />
    </div>
  )
}
