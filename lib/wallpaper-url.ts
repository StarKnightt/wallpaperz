import type { Wallpaper } from '@/types/wallpaper'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '')
}

/** URL segment: readable title slug + ImageKit fileId (the id is what lookups use). */
export function wallpaperSegment(w: Pick<Wallpaper, 'id' | 'title'>): string {
  const slug = slugify(w.title)
  return slug ? `${slug}-${w.id}` : w.id
}

export function wallpaperPath(w: Pick<Wallpaper, 'id' | 'title'>): string {
  return `/wallpaper/${wallpaperSegment(w)}`
}

/** Accepts both legacy `/wallpaper/<id>` and `/wallpaper/<slug>-<id>` segments. */
export function idFromSegment(segment: string): string {
  const hex = segment.match(/([0-9a-f]{24})$/i)
  if (hex) return hex[1]
  const dash = segment.lastIndexOf('-')
  return dash === -1 ? segment : segment.slice(dash + 1)
}
