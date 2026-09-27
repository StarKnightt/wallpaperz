import type { Wallpaper } from '@/types/wallpaper'

export type DeviceKind = 'phone' | 'tablet' | 'laptop' | 'desktop'

export interface Device {
  slug: string
  name: string
  brand: 'Apple' | 'Samsung' | 'Google' | 'Monitor'
  kind: DeviceKind
  /** Native panel pixels in the orientation the wallpaper is used (portrait for phones). */
  width: number
  height: number
  year?: number
  /** Shown in the page intro, e.g. "6.9-inch Super Retina XDR". */
  display?: string
  /** Popular enough to list on every wallpaper page. */
  featured?: boolean
}

// Resolutions from Apple / Google / Samsung spec sheets.
export const DEVICES: Device[] = [
  { slug: 'iphone-18-pro-max', name: 'iPhone 18 Pro Max', brand: 'Apple', kind: 'phone', width: 1320, height: 2868, year: 2026, display: '6.9-inch Super Retina XDR', featured: true },
  { slug: 'iphone-18-pro', name: 'iPhone 18 Pro', brand: 'Apple', kind: 'phone', width: 1206, height: 2622, year: 2026, display: '6.3-inch Super Retina XDR', featured: true },
  { slug: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max', brand: 'Apple', kind: 'phone', width: 1320, height: 2868, year: 2025, display: '6.9-inch Super Retina XDR', featured: true },
  { slug: 'iphone-17-pro', name: 'iPhone 17 Pro', brand: 'Apple', kind: 'phone', width: 1206, height: 2622, year: 2025, display: '6.3-inch Super Retina XDR' },
  { slug: 'iphone-17', name: 'iPhone 17', brand: 'Apple', kind: 'phone', width: 1206, height: 2622, year: 2025, display: '6.3-inch Super Retina XDR', featured: true },
  { slug: 'iphone-air', name: 'iPhone Air', brand: 'Apple', kind: 'phone', width: 1260, height: 2736, year: 2025, display: '6.5-inch Super Retina XDR' },
  { slug: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', brand: 'Apple', kind: 'phone', width: 1320, height: 2868, year: 2024, display: '6.9-inch Super Retina XDR' },
  { slug: 'iphone-16-pro', name: 'iPhone 16 Pro', brand: 'Apple', kind: 'phone', width: 1206, height: 2622, year: 2024, display: '6.3-inch Super Retina XDR' },
  { slug: 'iphone-16-plus', name: 'iPhone 16 Plus', brand: 'Apple', kind: 'phone', width: 1290, height: 2796, year: 2024, display: '6.7-inch Super Retina XDR' },
  { slug: 'iphone-16', name: 'iPhone 16', brand: 'Apple', kind: 'phone', width: 1179, height: 2556, year: 2024, display: '6.1-inch Super Retina XDR' },
  { slug: 'iphone-16e', name: 'iPhone 16e', brand: 'Apple', kind: 'phone', width: 1170, height: 2532, year: 2025, display: '6.1-inch Super Retina XDR' },
  { slug: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', brand: 'Apple', kind: 'phone', width: 1290, height: 2796, year: 2023, display: '6.7-inch Super Retina XDR' },
  { slug: 'iphone-15-pro', name: 'iPhone 15 Pro', brand: 'Apple', kind: 'phone', width: 1179, height: 2556, year: 2023, display: '6.1-inch Super Retina XDR' },
  { slug: 'iphone-15-plus', name: 'iPhone 15 Plus', brand: 'Apple', kind: 'phone', width: 1290, height: 2796, year: 2023, display: '6.7-inch Super Retina XDR' },
  { slug: 'iphone-15', name: 'iPhone 15', brand: 'Apple', kind: 'phone', width: 1179, height: 2556, year: 2023, display: '6.1-inch Super Retina XDR' },
  { slug: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', brand: 'Apple', kind: 'phone', width: 1290, height: 2796, year: 2022, display: '6.7-inch Super Retina XDR' },
  { slug: 'iphone-14-pro', name: 'iPhone 14 Pro', brand: 'Apple', kind: 'phone', width: 1179, height: 2556, year: 2022, display: '6.1-inch Super Retina XDR' },
  { slug: 'iphone-14-plus', name: 'iPhone 14 Plus', brand: 'Apple', kind: 'phone', width: 1284, height: 2778, year: 2022, display: '6.7-inch Super Retina XDR' },
  { slug: 'iphone-14', name: 'iPhone 14', brand: 'Apple', kind: 'phone', width: 1170, height: 2532, year: 2022, display: '6.1-inch Super Retina XDR' },
  { slug: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', brand: 'Apple', kind: 'phone', width: 1284, height: 2778, year: 2021, display: '6.7-inch Super Retina XDR' },
  { slug: 'iphone-13', name: 'iPhone 13', brand: 'Apple', kind: 'phone', width: 1170, height: 2532, year: 2021, display: '6.1-inch Super Retina XDR' },
  { slug: 'iphone-13-mini', name: 'iPhone 13 mini', brand: 'Apple', kind: 'phone', width: 1080, height: 2340, year: 2021, display: '5.4-inch Super Retina XDR' },
  { slug: 'iphone-12', name: 'iPhone 12', brand: 'Apple', kind: 'phone', width: 1170, height: 2532, year: 2020, display: '6.1-inch Super Retina XDR' },
  { slug: 'iphone-11', name: 'iPhone 11', brand: 'Apple', kind: 'phone', width: 828, height: 1792, year: 2019, display: '6.1-inch Liquid Retina' },
  { slug: 'iphone-se', name: 'iPhone SE', brand: 'Apple', kind: 'phone', width: 750, height: 1334, year: 2022, display: '4.7-inch Retina HD' },

  { slug: 'galaxy-s26-ultra', name: 'Galaxy S26 Ultra', brand: 'Samsung', kind: 'phone', width: 1440, height: 3120, year: 2026, display: '6.9-inch Dynamic AMOLED 2X', featured: true },
  { slug: 'galaxy-s26-plus', name: 'Galaxy S26+', brand: 'Samsung', kind: 'phone', width: 1440, height: 3120, year: 2026, display: '6.7-inch Dynamic AMOLED 2X' },
  { slug: 'galaxy-s26', name: 'Galaxy S26', brand: 'Samsung', kind: 'phone', width: 1080, height: 2340, year: 2026, display: '6.3-inch Dynamic AMOLED 2X' },
  { slug: 'galaxy-s25-ultra', name: 'Galaxy S25 Ultra', brand: 'Samsung', kind: 'phone', width: 1440, height: 3120, year: 2025, display: '6.9-inch Dynamic AMOLED 2X' },
  { slug: 'galaxy-s25', name: 'Galaxy S25', brand: 'Samsung', kind: 'phone', width: 1080, height: 2340, year: 2025, display: '6.2-inch Dynamic AMOLED 2X' },

  { slug: 'pixel-10-pro-xl', name: 'Pixel 10 Pro XL', brand: 'Google', kind: 'phone', width: 1344, height: 2992, year: 2025, display: '6.8-inch Super Actua' },
  { slug: 'pixel-10-pro', name: 'Pixel 10 Pro', brand: 'Google', kind: 'phone', width: 1280, height: 2856, year: 2025, display: '6.3-inch Super Actua', featured: true },
  { slug: 'pixel-10', name: 'Pixel 10', brand: 'Google', kind: 'phone', width: 1080, height: 2424, year: 2025, display: '6.3-inch Actua' },

  { slug: 'ipad-pro-13', name: 'iPad Pro 13-inch', brand: 'Apple', kind: 'tablet', width: 2752, height: 2064, year: 2024, display: '13-inch Ultra Retina XDR', featured: true },
  { slug: 'ipad-pro-11', name: 'iPad Pro 11-inch', brand: 'Apple', kind: 'tablet', width: 2420, height: 1668, year: 2024, display: '11-inch Ultra Retina XDR' },
  { slug: 'ipad-air-13', name: 'iPad Air 13-inch', brand: 'Apple', kind: 'tablet', width: 2732, height: 2048, year: 2024, display: '13-inch Liquid Retina' },
  { slug: 'ipad-air-11', name: 'iPad Air 11-inch', brand: 'Apple', kind: 'tablet', width: 2360, height: 1640, year: 2024, display: '11-inch Liquid Retina' },
  { slug: 'ipad', name: 'iPad (11-inch)', brand: 'Apple', kind: 'tablet', width: 2360, height: 1640, year: 2025, display: '11-inch Liquid Retina' },
  { slug: 'ipad-mini', name: 'iPad mini', brand: 'Apple', kind: 'tablet', width: 2266, height: 1488, year: 2024, display: '8.3-inch Liquid Retina' },

  { slug: 'macbook-air-13', name: 'MacBook Air 13-inch', brand: 'Apple', kind: 'laptop', width: 2560, height: 1664, display: '13.6-inch Liquid Retina', featured: true },
  { slug: 'macbook-air-15', name: 'MacBook Air 15-inch', brand: 'Apple', kind: 'laptop', width: 2880, height: 1864, display: '15.3-inch Liquid Retina' },
  { slug: 'macbook-pro-14', name: 'MacBook Pro 14-inch', brand: 'Apple', kind: 'laptop', width: 3024, height: 1964, display: '14.2-inch Liquid Retina XDR', featured: true },
  { slug: 'macbook-pro-16', name: 'MacBook Pro 16-inch', brand: 'Apple', kind: 'laptop', width: 3456, height: 2234, display: '16.2-inch Liquid Retina XDR' },
  { slug: 'imac-24', name: 'iMac 24-inch', brand: 'Apple', kind: 'desktop', width: 4480, height: 2520, display: '24-inch 4.5K Retina' },

  { slug: '1920x1080', name: '1920×1080 (Full HD)', brand: 'Monitor', kind: 'desktop', width: 1920, height: 1080, display: '1080p laptops and monitors', featured: true },
  { slug: '2560x1440', name: '2560×1440 (QHD)', brand: 'Monitor', kind: 'desktop', width: 2560, height: 1440, display: '1440p gaming monitors', featured: true },
  { slug: '3840x2160', name: '3840×2160 (4K UHD)', brand: 'Monitor', kind: 'desktop', width: 3840, height: 2160, display: '4K monitors and TVs', featured: true },
  { slug: '3440x1440', name: '3440×1440 (Ultrawide)', brand: 'Monitor', kind: 'desktop', width: 3440, height: 1440, display: '34-inch 21:9 ultrawide monitors' },
]

export const KIND_LABEL: Record<DeviceKind, string> = {
  phone: 'Phones',
  tablet: 'Tablets',
  laptop: 'Laptops',
  desktop: 'Desktops & monitors',
}

export function getDevice(slug: string): Device | undefined {
  return DEVICES.find((d) => d.slug === slug)
}

/** Other devices that share the exact same panel, e.g. 16 Pro Max / 17 Pro Max. */
export function sameSizeDevices(device: Device): Device[] {
  return DEVICES.filter((d) => d.slug !== device.slug && d.width === device.width && d.height === device.height)
}

export function aspectLabel(w: number, h: number): string {
  const long = Math.max(w, h)
  const short = Math.min(w, h)
  const r = long / short
  const known: [number, string][] = [[16 / 9, '16:9'], [16 / 10, '16:10'], [4 / 3, '4:3'], [3 / 2, '3:2'], [21 / 9, '21:9'], [2.39, '21:9'], [19.5 / 9, '19.5:9'], [20 / 9, '20:9'], [2.22, '20:9']]
  const hit = known.find(([k]) => Math.abs(k - r) < 0.03)
  const label = hit ? hit[1] : `${r.toFixed(2)}:1`
  if (w >= h) return label
  const [a, b] = label.split(':')
  return `${b}:${a}`
}

/** How much a wallpaper has to be enlarged to fill the device (1 = no upscale). */
export function upscaleFactor(w: Wallpaper, d: Device): number {
  if (!w.width || !w.height) return Infinity
  return Math.max(d.width / w.width, d.height / w.height)
}

const isPortrait = (w: Wallpaper) => !!(w.width && w.height && w.height > w.width)

/**
 * Wallpapers that crop cleanly to the device: matching orientation, and never
 * stretched more than ~50%. Keeps the library's newest-first order.
 */
export function wallpapersForDevice(all: Wallpaper[], d: Device): Wallpaper[] {
  const wantPortrait = d.height > d.width
  return all.filter((w) => isPortrait(w) === wantPortrait && upscaleFactor(w, d) <= 1.5)
}

export function devicesForWallpaper(w: Wallpaper): Device[] {
  return DEVICES.filter((d) => d.featured && isPortrait(w) === d.height > d.width && upscaleFactor(w, d) <= 1.5)
}

const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight'

function base(w: Wallpaper) {
  return w.imageUrl.startsWith('http') ? w.imageUrl : `${IK}${w.imageUrl}`
}

/** Exact-resolution crop with smart focus, served as a file download. */
export function deviceDownloadUrl(w: Wallpaper, d: Device): string {
  return `${base(w)}?tr=w-${d.width},h-${d.height},fo-auto,q-92&ik-attachment=true`
}

/** Thumbnail cropped to the device's shape. */
export function deviceThumbUrl(w: Wallpaper, d: Device, width = 360): string {
  const h = Math.round((width * d.height) / d.width)
  return `${base(w)}?tr=w-${width},h-${h},fo-auto,q-70,f-auto`
}
