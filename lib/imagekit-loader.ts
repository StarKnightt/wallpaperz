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
  const transform = `tr=w-${width},q-${quality || 80},f-auto`
  const separator = normalized.includes('?') ? '&' : '?'
  return `${ENDPOINT}${normalized}${separator}${transform}`
}
