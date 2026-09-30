// A route's `openGraph` replaces the root layout's wholesale, so any route that
// sets openGraph must also list images or it ships without an og:image.
export const DEFAULT_OG_IMAGE = {
  url: 'https://www.wallpaperz.in/theimage.png',
  width: 1200,
  height: 630,
  alt: 'Wallpaperz - free HD & 4K wallpapers',
}
