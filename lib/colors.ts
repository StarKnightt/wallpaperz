import { Wallpaper } from '@/types/wallpaper'

export interface ColorDef {
  slug: string
  name: string
  /** ImageKit tag written by scripts/tag-colors.mjs */
  tag: string
  /** Swatch used in UI chips */
  swatch: string
  seoTitle: string
  seoDescription: string
  intro: string
}

export const COLOR_DEFS: ColorDef[] = [
  {
    slug: 'dark',
    name: 'Dark',
    tag: 'color-dark',
    swatch: '#0a0a0f',
    seoTitle: 'Dark Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Download free dark wallpapers in HD and 4K. OLED-friendly black and moody backgrounds for desktop and phone. No watermarks, original quality.',
    intro:
      'Dark wallpapers are easier on the eyes at night, save battery on OLED screens, and make icons and widgets pop. Every wallpaper here leans into deep shadows and moody tones - perfect for a clean desktop or an AMOLED phone.',
  },
  {
    slug: 'black',
    name: 'Black',
    tag: 'color-black',
    swatch: '#000000',
    seoTitle: 'Black Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free black wallpapers in HD and 4K for desktop and mobile. True-black OLED backgrounds, minimal dark art, and moody scenes. Download in original quality.',
    intro:
      'True black backgrounds turn off OLED pixels entirely, which means deeper contrast and real battery savings. These wallpapers are dominated by black - from pure minimalism to detailed art on dark canvases.',
  },
  {
    slug: 'blue',
    name: 'Blue',
    tag: 'color-blue',
    swatch: '#2563eb',
    seoTitle: 'Blue Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free blue wallpapers in HD and 4K. Ocean tones, night skies, neon cyan and calm gradients for desktop and phone. Download in original quality.',
    intro:
      'Blue is the most popular wallpaper color for a reason - it reads calm, focused, and clean on any screen. This collection spans deep ocean tones, night skies, and electric neon blues.',
  },
  {
    slug: 'purple',
    name: 'Purple',
    tag: 'color-purple',
    swatch: '#8b5cf6',
    seoTitle: 'Purple Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free purple wallpapers in HD and 4K. Violet nebulas, synthwave gradients and dreamy fantasy scenes for desktop and phone. Original quality downloads.',
    intro:
      'Purple sits between the energy of red and the calm of blue - which is why violet nebulas, synthwave sunsets, and dreamy gradients feel both bold and relaxing as backgrounds.',
  },
  {
    slug: 'pink',
    name: 'Pink',
    tag: 'color-pink',
    swatch: '#ec4899',
    seoTitle: 'Pink Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free pink aesthetic wallpapers in HD and 4K. Soft pastels, neon magenta and cherry blossom scenes for desktop and phone. Original quality downloads.',
    intro:
      'From soft pastel gradients to hot neon magenta, pink wallpapers bring warmth and personality to a home screen. A favorite for aesthetic phone setups.',
  },
  {
    slug: 'green',
    name: 'Green',
    tag: 'color-green',
    swatch: '#22c55e',
    seoTitle: 'Green Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free green wallpapers in HD and 4K. Forests, aurora skies, misty nature and emerald abstracts for desktop and phone. Original quality downloads.',
    intro:
      'Green backgrounds bring the calm of nature to your screen - forests, aurora skies, and mossy landscapes that are easy to look at for hours.',
  },
  {
    slug: 'orange',
    name: 'Orange',
    tag: 'color-orange',
    swatch: '#f97316',
    seoTitle: 'Orange Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free orange wallpapers in HD and 4K. Sunsets, golden hour light, ember and amber tones for desktop and phone. Original quality downloads.',
    intro:
      'Orange is the color of golden hour - sunsets, embers, and warm desert light. These wallpapers add energy and warmth to any setup.',
  },
  {
    slug: 'red',
    name: 'Red',
    tag: 'color-red',
    swatch: '#ef4444',
    seoTitle: 'Red Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free red wallpapers in HD and 4K. Crimson skies, neon red accents and bold dramatic scenes for desktop and phone. Original quality downloads.',
    intro:
      'Red wallpapers make a statement - crimson skies, glowing embers, and bold accents that stand out instantly on any screen.',
  },
  {
    slug: 'yellow',
    name: 'Yellow',
    tag: 'color-yellow',
    swatch: '#eab308',
    seoTitle: 'Yellow Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free yellow wallpapers in HD and 4K. Golden light, amber gradients and warm minimal backgrounds for desktop and phone. Original quality downloads.',
    intro:
      'Golden and amber tones feel optimistic and warm. These wallpapers are dominated by yellows - from soft morning light to rich honey gradients.',
  },
  {
    slug: 'teal',
    name: 'Teal',
    tag: 'color-teal',
    swatch: '#14b8a6',
    seoTitle: 'Teal Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free teal and cyan wallpapers in HD and 4K. Aurora greens, tropical water and cool futuristic tones for desktop and phone. Original quality downloads.',
    intro:
      'Teal sits between blue and green - the color of tropical water, auroras, and futuristic UI glow. A modern, cool-toned choice for any screen.',
  },
  {
    slug: 'white',
    name: 'White',
    tag: 'color-white',
    swatch: '#f4f4f5',
    seoTitle: 'White & Light Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free white and light wallpapers in HD and 4K. Clean minimal backgrounds, soft mist and bright airy scenes for desktop and phone.',
    intro:
      'Light wallpapers keep a desktop feeling clean and distraction-free. Bright, airy backgrounds that pair beautifully with light-mode setups.',
  },
  {
    slug: 'gray',
    name: 'Gray',
    tag: 'color-gray',
    swatch: '#6b7280',
    seoTitle: 'Gray Wallpapers - Free HD & 4K Downloads',
    seoDescription:
      'Free gray wallpapers in HD and 4K. Monochrome scenes, soft neutral gradients and minimal backgrounds for desktop and phone.',
    intro:
      'Neutral gray backgrounds are the most versatile of all - they match every icon pack, every theme, and never distract from your work.',
  },
]

export const MIN_WALLPAPERS_PER_COLOR = 6

export function getColorBySlug(slug: string): ColorDef | undefined {
  return COLOR_DEFS.find((c) => c.slug === slug)
}

export function wallpapersForColor(all: Wallpaper[], color: ColorDef): Wallpaper[] {
  return all.filter((w) => w.tags?.includes(color.tag))
}

/** Colors that have enough wallpapers to justify a landing page. */
export function qualifyingColors(all: Wallpaper[]): { color: ColorDef; count: number }[] {
  return COLOR_DEFS.map((color) => ({ color, count: wallpapersForColor(all, color).length }))
    .filter(({ count }) => count >= MIN_WALLPAPERS_PER_COLOR)
}
