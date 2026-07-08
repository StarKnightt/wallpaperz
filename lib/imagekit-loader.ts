/**
 * Custom next/image loader that resizes through ImageKit transformations
 * (w-{width}, q-{quality}, f-auto) instead of Vercel's image optimizer.
 * Keeps bandwidth off Vercel's quota and serves WebP/AVIF from the CDN edge.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight'

export function imagekitLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  // Leave non-ImageKit URLs (e.g. Clerk avatars) untouched
  if (src.startsWith('http') && !src.startsWith(ENDPOINT)) return src

  const path = src.startsWith('http') ? src.slice(ENDPOINT.length) : src
  const normalized = path.startsWith('/') ? path : `/${path}`
  // Commas are URL-encoded because raw commas inside srcset URLs break some
  // browsers' srcset/preload parsers (Firefox requests the "q-80,f-auto" tail
  // as a relative URL). ImageKit decodes %2C back to commas server-side.
  const transform = `tr=w-${width}%2Cq-${quality || 80}%2Cf-auto`
  const separator = normalized.includes('?') ? '&' : '?'
  return `${ENDPOINT}${normalized}${separator}${transform}`
}
