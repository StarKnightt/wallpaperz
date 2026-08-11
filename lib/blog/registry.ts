import { Metadata } from 'next'

export type BlogCluster = 'How-To Guides' | 'Device Guides' | 'Inspiration'

export interface BlogPost {
  slug: string
  /** H1 + social title */
  title: string
  /** <title> tag - root layout template appends "| Wallpaperz" */
  metaTitle: string
  description: string
  /** ISO date */
  date: string
  cluster: BlogCluster
  minutes: number
  /** ImageKit file path under /wallpapers/ used as cover */
  cover: string
  coverAlt: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'fall-aesthetic-wallpapers',
    title: 'Fall Aesthetic Wallpapers: Cozy Autumn Backgrounds for iPhone & Desktop (2026)',
    metaTitle: 'Fall Aesthetic Wallpapers - Cozy Autumn Backgrounds (2026)',
    description:
      'The best fall aesthetic wallpapers for 2026: cozy cabin scenes, moody autumn palettes, and desert-highway golds - plus how to pick the right resolution for iPhone, Android, and desktop.',
    date: '2026-08-11',
    cluster: 'Inspiration',
    minutes: 7,
    cover: '/wallpapers/autumn-cabin-lake-reflection-2k-wallpaperz.jpg',
    coverAlt: 'Cozy autumn cabin beside a lake with fall foliage reflected in still water',
  },
  {
    slug: 'halloween-phone-wallpapers',
    title: 'Halloween Phone Wallpapers: Spooky Lock Screens for iPhone & Android (2026)',
    metaTitle: 'Halloween Phone Wallpapers - Spooky Lock Screens (2026)',
    description:
      'Free Halloween phone wallpapers and how to use them: moody pumpkin porches, OLED-friendly dark scenes, lock screen readability tips, and the right size for iPhone and Android.',
    date: '2026-08-11',
    cluster: 'Inspiration',
    minutes: 6,
    cover: '/wallpapers/halloween-pumpkin-porch-moonlight-mobile-wallpaperz.jpg',
    coverAlt: 'Glowing jack-o-lantern on a porch under moonlight, Halloween phone wallpaper',
  },
  {
    slug: 'americana-wallpapers',
    title: 'Americana Wallpapers: Route 66, Muscle Cars & Desert Highways',
    metaTitle: 'Americana Wallpapers - Route 66, Muscle Cars & Desert Highways',
    description:
      'A curated collection of Americana wallpapers - Route 66 sunsets, retro diners with muscle cars, Monument Valley mesas, and NYC blue hour - with tips for desktop, ultrawide, and phone.',
    date: '2026-08-11',
    cluster: 'Inspiration',
    minutes: 7,
    cover: '/wallpapers/route-66-desert-highway-sunset-2k-wallpaperz.jpg',
    coverAlt: 'Empty Route 66 desert highway stretching toward a golden sunset',
  },
  {
    slug: 'how-to-set-live-wallpaper-windows-11',
    title: 'How to Set a Live Wallpaper on Windows 11 (2026 Guide)',
    metaTitle: 'How to Set a Live Wallpaper on Windows 11 - 2026 Guide',
    description:
      'Set animated and video wallpapers on Windows 11 with free tools like Lively Wallpaper, plus built-in slideshow tricks, performance tips, and the right resolution to use.',
    date: '2026-08-01',
    cluster: 'How-To Guides',
    minutes: 7,
    cover: '/wallpapers/synthwave-outrun-supercar-sunset-2k-wallpaperz.jpg',
    coverAlt: 'Synthwave animated-style wallpaper on a desktop monitor',
  },
  {
    slug: 'best-wallpaper-size-for-iphone',
    title: 'Best Wallpaper Size for iPhone: Every Model Explained (2026)',
    metaTitle: 'Best Wallpaper Size for iPhone - Every Model (2026)',
    description:
      'Exact iPhone wallpaper resolutions for every model, why your wallpaper gets zoomed in, and how to size images so they stay sharp on the lock screen.',
    date: '2026-08-01',
    cluster: 'Device Guides',
    minutes: 6,
    cover: '/wallpapers/cozy-rainy-window-night-bokeh-mobile-wallpaperz.jpg',
    coverAlt: 'Cozy rainy window phone wallpaper shown at iPhone aspect ratio',
  },
  {
    slug: 'wallpaper-resolution-guide',
    title: '1080p vs 1440p vs 4K Wallpapers: Which Resolution Do You Actually Need?',
    metaTitle: '1080p vs 1440p vs 4K Wallpapers - Resolution Guide',
    description:
      'What wallpaper resolution to download for your monitor or phone, why 4K images look better even on 1080p screens, and how aspect ratio actually works.',
    date: '2026-08-01',
    cluster: 'Device Guides',
    minutes: 8,
    cover: '/wallpapers/abstract-liquid-chrome-waves-2k-wallpaperz.jpg',
    coverAlt: 'Liquid chrome abstract wallpaper demonstrating fine 4K detail',
  },
  {
    slug: 'dual-monitor-wallpaper-setup',
    title: 'How to Set Different Wallpapers on Dual Monitors (Windows & Mac)',
    metaTitle: 'Dual Monitor Wallpapers - Different Image per Screen',
    description:
      'Set a different wallpaper on each monitor in Windows 11 and macOS, span one image across both screens, and handle mismatched resolutions cleanly.',
    date: '2026-08-01',
    cluster: 'How-To Guides',
    minutes: 6,
    cover: '/wallpapers/circuit-board-city-data-streams-2k-wallpaperz.jpg',
    coverAlt: 'Wide futuristic circuit board wallpaper suited to multi-monitor setups',
  },
  {
    slug: 'how-to-make-ai-wallpapers',
    title: 'How to Make AI Wallpapers That Actually Look Good',
    metaTitle: 'How to Make AI Wallpapers - Prompts, Sizes & Tips',
    description:
      'A practical guide to generating your own AI wallpapers: prompt structure that works, the right aspect ratios for phone and desktop, and how to avoid the usual AI artifacts.',
    date: '2026-08-01',
    cluster: 'How-To Guides',
    minutes: 7,
    cover: '/wallpapers/ethereal-girl-glowing-butterflies-2k-wallpaperz.jpg',
    coverAlt: 'AI-generated fantasy portrait wallpaper with glowing butterflies',
  },
  {
    slug: 'dark-aesthetic-wallpapers',
    title: 'Dark Aesthetic Wallpapers: Why They Work and Our Favorites',
    metaTitle: 'Dark Aesthetic Wallpapers - OLED-Friendly Picks',
    description:
      'Why dark wallpapers dominate desk setups in 2026 - OLED battery savings, eye comfort, contrast - plus a hand-picked gallery of free dark wallpapers.',
    date: '2026-08-01',
    cluster: 'Inspiration',
    minutes: 5,
    cover: '/wallpapers/bg-wallpaperz-4k-minimalist.png',
    coverAlt: 'Minimal dark wallpaper with subtle glow',
  },
  {
    slug: 'fix-blurry-phone-wallpaper',
    title: 'Why Your Phone Wallpaper Looks Blurry (and How to Fix It)',
    metaTitle: 'Fix Blurry Phone Wallpaper - iPhone & Android',
    description:
      'Wallpaper looks blurry, zoomed-in, or pixelated on your phone? Here is what actually causes it - resolution, parallax, compression - and the fix for iPhone and Android.',
    date: '2026-08-01',
    cluster: 'How-To Guides',
    minutes: 6,
    cover: '/wallpapers/astronaut-cherry-blossoms-space-mobile-wallpaperz.jpg',
    coverAlt: 'Sharp portrait phone wallpaper of an astronaut among cherry blossoms',
  },
]

const BASE_URL = 'https://wallpaperz.in'
const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight'

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function coverUrl(post: BlogPost, width = 1200): string {
  return `${IK}${encodeURI(post.cover)}?tr=w-${width},q-70,f-auto`
}

export function relatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPost(slug)
  if (!current) return BLOG_POSTS.slice(0, limit)
  return [...BLOG_POSTS]
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aSame = a.cluster === current.cluster ? 0 : 1
      const bSame = b.cluster === current.cluster ? 0 : 1
      return aSame - bSame
    })
    .slice(0, limit)
}

/** Shared metadata builder for post pages. */
export function postMetadata(slug: string): Metadata {
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: coverUrl(post), width: 1200, alt: post.coverAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [coverUrl(post)],
    },
  }
}
