// Paid wallpaper packs sold on Gumroad. Every member wallpaper is also free on
// the site; a pack is the curated set pre-cropped for every device size.
// Member names are ImageKit file names under /wallpapers/ (read-only).

const IK_WALLPAPERS = "https://ik.imagekit.io/starknight/wallpapers"

export interface Pack {
  slug: string
  name: string
  tagline: string
  priceUsd: number
  gumroadUrl: string
  /** Number of designs in the pack */
  count: number
  /** Number of exact-size image files in the download */
  fileCount: number
  deviceSizes: string[]
  /** ImageKit file names of every member wallpaper */
  members: string[]
  /** 4 member file names used for the card mosaic, first is the hero tile */
  covers: string[]
  /** Category slugs (/category/<slug>) that show a banner for this pack */
  categories: string[]
  featured?: boolean
}

export const PACK_DEVICE_SIZES = [
  "iPhone 1320 × 2868",
  "Android 1440 × 3120",
  "iPad 2048 × 2732 / 2732 × 2048",
  "Desktop 1080p, 1440p & 4K",
]

const COZY_AUTUMN = [
  "cozy-cabin-window-rain-fall-leaves-mobile-wallpaperz.jpg",
  "autumn-cabin-lake-reflection-2k-wallpaperz.jpg",
  "pumpkin-patch-golden-hour-mobile-wallpaperz.jpg",
  "zen-garden-crimson-maple-mist-2k-wallpaperz.jpg",
  "ginkgo-yellow-autumn-mobile-wallpaperz.jpg",
  "golden-honey-silk-2k-wallpaperz.jpg",
  "blonde-girl-autumn-street-style-mobile-wallpaperz.jpg",
  "halloween-night-street-jack-o-lanterns-2k-wallpaperz.jpg",
  "halloween-pumpkin-porch-moonlight-mobile-wallpaperz.jpg",
  "burnt-orange-rose-autumn-gradient-mobile-wallpaperz.jpg",
  "cozy-rainy-window-night-bokeh-mobile-wallpaperz.jpg",
]

const DARK_MOODY_ACADEMIA = [
  "candlelit-study-desk-dark-academia-2k-wallpaperz.jpg",
  "asian-girl-glasses-library-night-mobile-wallpaperz.jpg",
  "foggy-pine-forest-dusk-mobile-wallpaperz.jpg",
  "abstract-liquid-chrome-waves-2k-wallpaperz.jpg",
  "midnight-ocean-storm-clouds-mobile-wallpaperz.jpg",
  "deep-violet-dusk-aurora-2k-wallpaperz.jpg",
  "charcoal-black-slate-abstract-mobile-wallpaperz.jpg",
  "cozy-rainy-window-night-bokeh-mobile-wallpaperz.jpg",
  "deep-purple-black-gradient-mobile-wallpaperz.jpg",
]

const NEON_CYBERPUNK_NIGHTS = [
  "cyberpunk-rain-street-neon-2k-wallpaperz.jpg",
  "cyberpunk-girl-pink-hair-mobile-wallpaperz.jpg",
  "synthwave-outrun-supercar-sunset-2k-wallpaperz.jpg",
  "rainy-neon-alley-night-mobile-wallpaperz.jpg",
  "anime-girl-katana-neon-rooftop-2k-wallpaperz.jpg",
  "tokyo-neon-street-fashion-girl-mobile-wallpaperz.jpg",
  "circuit-board-city-data-streams-2k-wallpaperz.jpg",
  "asian-girl-glasses-neon-night-mobile-wallpaperz.jpg",
  "muscle-car-retro-diner-neon-2k-wallpaperz.jpg",
  "nyc-brooklyn-bridge-blue-hour-mobile-wallpaperz.jpg",
]

const FANTASY_WORLDS = [
  "fantasy-floating-castle-dawn-2k-wallpaperz.jpg",
  "crystal-cave-explorer-mobile-wallpaperz.jpg",
  "fantasy-ember-dragon-above-clouds-2k-wallpaperz.jpg",
  "enchanted-forest-deer-spirit-2k-wallpaperz.jpg",
  "lone-figure-nebula-mountain-summit-mobile-wallpaperz.jpg",
  "phoenix-ember-wings-night-2k-wallpaperz.jpg",
  "sunken-city-whale-godrays-2k-wallpaperz.jpg",
  "valkyrie-spectral-wings-cliff-2k-wallpaperz.jpg",
  "ethereal-girl-glowing-butterflies-2k-wallpaperz.jpg",
  "anime-torii-gate-sky-lanterns-2k-wallpaperz.jpg",
]

const SPACE_COSMOS = [
  "violet-spiral-nebula-ringed-planet-2k-wallpaperz.jpg",
  "astronaut-cherry-blossoms-space-mobile-wallpaperz.jpg",
  "aurora-borealis-mountain-lake-2k-wallpaperz.jpg",
  "lone-figure-nebula-mountain-summit-mobile-wallpaperz.jpg",
  "deep-violet-dusk-aurora-2k-wallpaperz.jpg",
  "deep-purple-black-gradient-mobile-wallpaperz.jpg",
  "minimal-desert-dunes-dusk-2k-wallpaperz.jpg",
]

const SOFT_MINIMAL_AESTHETIC = [
  "pearl-white-silk-waves-2k-wallpaperz.jpg",
  "lavender-flow-gradient-mobile-wallpaperz.jpg",
  "sage-cream-gradient-2k-wallpaperz.jpg",
  "matcha-leaf-shadow-minimal-mobile-wallpaperz.jpg",
  "white-marble-soft-light-2k-wallpaperz.jpg",
  "white-fog-mountains-minimal-mobile-wallpaperz.jpg",
  "snow-minimal-lone-tree-white-2k-wallpaperz.jpg",
  "pastel-yellow-shapes-minimal-mobile-wallpaperz.jpg",
  "fluid-gradient-violet-silk-2k-wallpaperz.jpg",
  "spring-green-silk-gradient-mobile-wallpaperz.jpg",
  "lemon-yellow-silk-gradient-2k-wallpaperz.jpg",
  "burnt-orange-rose-autumn-gradient-mobile-wallpaperz.jpg",
]

const NATURE_GREENS = [
  "sunlit-forest-canopy-green-2k-wallpaperz.jpg",
  "spring-green-silk-gradient-mobile-wallpaperz.jpg",
  "rolling-green-hills-morning-2k-wallpaperz.jpg",
  "tropical-monstera-leaves-green-2k-wallpaperz.jpg",
  "matcha-leaf-shadow-minimal-mobile-wallpaperz.jpg",
  "terraced-rice-fields-green-2k-wallpaperz.jpg",
  "emerald-glass-flow-2k-wallpaperz.jpg",
  "foggy-pine-forest-dusk-mobile-wallpaperz.jpg",
  "aurora-borealis-mountain-lake-2k-wallpaperz.jpg",
  "yellow-tulip-field-spring-2k-wallpaperz.jpg",
  "sunflower-field-bright-daylight-2k-wallpaperz.jpg",
]

export const THEMED_PACKS: Pack[] = [
  {
    slug: "cozy-autumn",
    name: "Cozy Autumn",
    tagline: "Lakeside cabins, rainy window nooks, pumpkin patches at golden hour and glowing jack-o'-lantern streets.",
    priceUsd: 5.99,
    gumroadUrl: "https://prasenjitt.gumroad.com/l/oncswt",
    count: COZY_AUTUMN.length,
    fileCount: 37,
    deviceSizes: PACK_DEVICE_SIZES,
    members: COZY_AUTUMN,
    covers: [
      "autumn-cabin-lake-reflection-2k-wallpaperz.jpg",
      "pumpkin-patch-golden-hour-mobile-wallpaperz.jpg",
      "cozy-cabin-window-rain-fall-leaves-mobile-wallpaperz.jpg",
      "halloween-night-street-jack-o-lanterns-2k-wallpaperz.jpg",
    ],
    categories: [],
  },
  {
    slug: "dark-moody-academia",
    name: "Dark & Moody Academia",
    tagline: "Candlelit study desks, fog-wrapped pines, storm-lit oceans and deep violet gradients. Calm, OLED-friendly.",
    priceUsd: 4.99,
    gumroadUrl: "https://prasenjitt.gumroad.com/l/ckwffv",
    count: DARK_MOODY_ACADEMIA.length,
    fileCount: 30,
    deviceSizes: PACK_DEVICE_SIZES,
    members: DARK_MOODY_ACADEMIA,
    covers: [
      "candlelit-study-desk-dark-academia-2k-wallpaperz.jpg",
      "asian-girl-glasses-library-night-mobile-wallpaperz.jpg",
      "midnight-ocean-storm-clouds-mobile-wallpaperz.jpg",
      "deep-violet-dusk-aurora-2k-wallpaperz.jpg",
    ],
    categories: [],
  },
  {
    slug: "neon-cyberpunk-nights",
    name: "Neon Cyberpunk Nights",
    tagline: "Rain-soaked neon streets, a synthwave supercar, a katana heroine on a rooftop and glowing circuit cities.",
    priceUsd: 5.49,
    gumroadUrl: "https://prasenjitt.gumroad.com/l/xdfojn",
    count: NEON_CYBERPUNK_NIGHTS.length,
    fileCount: 35,
    deviceSizes: PACK_DEVICE_SIZES,
    members: NEON_CYBERPUNK_NIGHTS,
    covers: [
      "cyberpunk-rain-street-neon-2k-wallpaperz.jpg",
      "cyberpunk-girl-pink-hair-mobile-wallpaperz.jpg",
      "rainy-neon-alley-night-mobile-wallpaperz.jpg",
      "synthwave-outrun-supercar-sunset-2k-wallpaperz.jpg",
    ],
    categories: ["city", "technology"],
  },
  {
    slug: "fantasy-worlds",
    name: "Fantasy Worlds",
    tagline: "Floating sky castles, an ember dragon above the clouds, a blazing phoenix and a sunken city with a giant whale.",
    priceUsd: 5.49,
    gumroadUrl: "https://prasenjitt.gumroad.com/l/ixcgma",
    count: FANTASY_WORLDS.length,
    fileCount: 38,
    deviceSizes: PACK_DEVICE_SIZES,
    members: FANTASY_WORLDS,
    covers: [
      "fantasy-floating-castle-dawn-2k-wallpaperz.jpg",
      "crystal-cave-explorer-mobile-wallpaperz.jpg",
      "fantasy-ember-dragon-above-clouds-2k-wallpaperz.jpg",
      "phoenix-ember-wings-night-2k-wallpaperz.jpg",
    ],
    categories: ["fantasy"],
  },
  {
    slug: "space-cosmos",
    name: "Space & Cosmos",
    tagline: "A violet spiral nebula, an astronaut among cherry blossoms, northern lights and a lone figure beneath the galaxy.",
    priceUsd: 3.99,
    gumroadUrl: "https://prasenjitt.gumroad.com/l/gdnpxo",
    count: SPACE_COSMOS.length,
    fileCount: 25,
    deviceSizes: PACK_DEVICE_SIZES,
    members: SPACE_COSMOS,
    covers: [
      "violet-spiral-nebula-ringed-planet-2k-wallpaperz.jpg",
      "astronaut-cherry-blossoms-space-mobile-wallpaperz.jpg",
      "lone-figure-nebula-mountain-summit-mobile-wallpaperz.jpg",
      "aurora-borealis-mountain-lake-2k-wallpaperz.jpg",
    ],
    categories: ["space"],
  },
  {
    slug: "soft-minimal-aesthetic",
    name: "Soft Minimal Aesthetic",
    tagline: "Pearl silk, white marble, sage and lavender gradients and matcha leaf shadows. Clutter-free, icons pop.",
    priceUsd: 5.99,
    gumroadUrl: "https://prasenjitt.gumroad.com/l/fjxbxe",
    count: SOFT_MINIMAL_AESTHETIC.length,
    fileCount: 42,
    deviceSizes: PACK_DEVICE_SIZES,
    members: SOFT_MINIMAL_AESTHETIC,
    covers: [
      "pearl-white-silk-waves-2k-wallpaperz.jpg",
      "lavender-flow-gradient-mobile-wallpaperz.jpg",
      "white-fog-mountains-minimal-mobile-wallpaperz.jpg",
      "sage-cream-gradient-2k-wallpaperz.jpg",
    ],
    categories: ["minimalist"],
  },
  {
    slug: "nature-greens",
    name: "Nature Greens & Spring Fields",
    tagline: "Sunlit forest canopies, rolling hills, monstera jungle, misty rice terraces and tulip and sunflower fields.",
    priceUsd: 5.49,
    gumroadUrl: "https://prasenjitt.gumroad.com/l/phoez",
    count: NATURE_GREENS.length,
    fileCount: 41,
    deviceSizes: PACK_DEVICE_SIZES,
    members: NATURE_GREENS,
    covers: [
      "sunlit-forest-canopy-green-2k-wallpaperz.jpg",
      "spring-green-silk-gradient-mobile-wallpaperz.jpg",
      "matcha-leaf-shadow-minimal-mobile-wallpaperz.jpg",
      "rolling-green-hills-morning-2k-wallpaperz.jpg",
    ],
    categories: ["nature"],
  },
]

const MEGA_MEMBERS = Array.from(new Set(THEMED_PACKS.flatMap((p) => p.members)))

export const MEGA_PACK: Pack = {
  slug: "mega-bundle",
  name: "Mega Bundle",
  tagline: "All seven collections in one download: autumn, academia, neon, fantasy, space, minimal and nature.",
  priceUsd: 14.99,
  gumroadUrl: "https://prasenjitt.gumroad.com/l/vgpkfd",
  count: MEGA_MEMBERS.length,
  fileCount: THEMED_PACKS.reduce((n, p) => n + p.fileCount, 0),
  deviceSizes: PACK_DEVICE_SIZES,
  members: MEGA_MEMBERS,
  covers: [
    "fantasy-floating-castle-dawn-2k-wallpaperz.jpg",
    "cyberpunk-girl-pink-hair-mobile-wallpaperz.jpg",
    "pumpkin-patch-golden-hour-mobile-wallpaperz.jpg",
    "astronaut-cherry-blossoms-space-mobile-wallpaperz.jpg",
  ],
  categories: [],
  featured: true,
}

export const PACKS: Pack[] = [MEGA_PACK, ...THEMED_PACKS]

/** Sum of the themed packs bought one by one, for the Mega Bundle comparison. */
export const THEMED_PACKS_TOTAL_USD = Math.round(THEMED_PACKS.reduce((n, p) => n + p.priceUsd, 0) * 100) / 100

export function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`
}

export type PackPlacement = "packs-page" | "wallpaper-page" | "category-banner"

export function packHref(pack: Pack, placement: PackPlacement): string {
  return `${pack.gumroadUrl}?utm_source=wallpaperz&utm_medium=site&utm_campaign=${placement}`
}

/** ImageKit thumbnail for a member file (never the original). */
export function packThumb(file: string, width = 600): string {
  return `${IK_WALLPAPERS}/${file}?tr=w-${width},q-80`
}

/** ImageKit file name from a wallpaper imageUrl / filePath, query stripped. */
export function fileNameOf(imageUrl: string): string {
  return imageUrl.split("?")[0].split("/").pop() ?? ""
}

/**
 * The single themed pack to suggest for a wallpaper. Files in two packs
 * prefer the pack mapped to the wallpaper's own category.
 */
export function packForWallpaper(imageUrl: string, category?: string): Pack | undefined {
  const file = fileNameOf(imageUrl)
  const matches = THEMED_PACKS.filter((p) => p.members.includes(file))
  if (matches.length === 0) return undefined
  const cat = category?.toLowerCase()
  return matches.find((p) => cat && p.categories.includes(cat)) ?? matches[0]
}

export function packForCategory(slug: string): Pack | undefined {
  const s = slug.toLowerCase()
  return THEMED_PACKS.find((p) => p.categories.includes(s))
}
