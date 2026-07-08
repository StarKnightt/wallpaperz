/**
 * Shared tag -> category mapping used by both the sync API route and the
 * server-side wallpaper fetchers. ImageKit tags are free-form, so this maps
 * the tags actually used in the media library to display categories.
 */
const TAG_CATEGORY_MAP: Record<string, string> = {
  abstract: 'Abstract',
  gradient: 'Abstract',
  gradiant: 'Abstract',
  art: 'Art',
  arts: 'Art',
  aesthetic: 'Art',
  minimalist: 'Minimalist',
  minimal: 'Minimalist',
  fantasy: 'Fantasy',
  nature: 'Nature',
  space: 'Space',
  technology: 'Technology',
  tech: 'Technology',
  code: 'Technology',
  anime: 'Anime',
  city: 'City',
  cars: 'Cars',
  car: 'Cars',
  gaming: 'Gaming',
  game: 'Gaming',
  games: 'Gaming',
  people: 'People',
  girl: 'People',
  kpop: 'People',
  celebrity: 'People',
}

export function resolveCategory(customCategory?: string, tags?: string[] | null): string {
  if (customCategory) return customCategory

  for (const rawTag of tags ?? []) {
    const mapped = TAG_CATEGORY_MAP[rawTag.trim().toLowerCase()]
    if (mapped) return mapped
  }
  return 'Other'
}

const DROP_TOKENS = new Set(['wallpaperz', 'wallpaper', 'wallpapers'])
const UPPER_TOKENS = new Set(['4k', '2k', '8k', 'hd', 'uhd'])

/** "gaeul-ive-i-am-4k-wallpaperz.jpg" -> "Gaeul Ive I Am 4K" */
export function cleanFilename(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .split(/[-_\s]+/)
    .filter((token) => token && !DROP_TOKENS.has(token.toLowerCase()))
    .map((token) => {
      const lower = token.toLowerCase()
      if (UPPER_TOKENS.has(lower)) return lower.toUpperCase()
      return token.charAt(0).toUpperCase() + token.slice(1)
    })
    .join(' ')
}
