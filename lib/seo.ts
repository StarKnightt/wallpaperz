export const SITE_NAME = 'Wallpaperz'
export const SITE_URL = 'https://www.wallpaperz.in'

// Official profiles, used as Organization sameAs in the homepage JSON-LD.
export const SOCIAL_PROFILES = [
  'https://www.pinterest.com/wallpaperzin',
  'https://github.com/StarKnightt/wallpaperz',
  'https://peerlist.io/prasen/project/wallpaperz',
]

// A route's `openGraph` replaces the root layout's wholesale, so any route that
// sets openGraph must also list images or it ships without an og:image.
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/theimage.png`,
  width: 1200,
  height: 630,
  alt: 'Wallpaperz - free HD & 4K wallpapers',
}
