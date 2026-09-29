const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || "https://ik.imagekit.io/starknight"

/** ImageKit URL for a library file at a given width. Any existing query (e.g. ?updatedAt=) is dropped first. */
export function libraryImage(file: string, width = 600, quality = 80) {
  const clean = file.split("?")[0]
  return `${IK}/wallpapers/${clean}?tr=w-${width},q-${quality},f-auto`
}

export interface PromptExample {
  title: string
  prompt: string
  file: string
}

/** Real AI originals from the library, each paired with a prompt that describes it. */
export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    title: "Aurora over the lake",
    prompt: "Aurora borealis over a snow-covered mountain range, reflected in a perfectly still lake, photorealistic, cinematic lighting",
    file: "aurora-borealis-mountain-lake-2k-wallpaperz.jpg",
  },
  {
    title: "Neon rain",
    prompt: "Rain-soaked cyberpunk street at night, neon signs reflecting in puddles, volumetric fog, ultra detailed digital art",
    file: "cyberpunk-rain-street-neon-2k-wallpaperz.jpg",
  },
  {
    title: "Castle at dawn",
    prompt: "Floating castle above the clouds at dawn, waterfalls pouring into the sky, soft golden light, epic fantasy matte painting",
    file: "fantasy-floating-castle-dawn-2k-wallpaperz.jpg",
  },
  {
    title: "Sunken city",
    prompt: "Sunken city on the ocean floor, a giant whale gliding through god rays, deep blue water, cinematic wide shot",
    file: "sunken-city-whale-godrays-2k-wallpaperz.jpg",
  },
  {
    title: "Maples in mist",
    prompt: "Japanese zen garden with crimson maple trees in morning mist, raked gravel, calm and quiet, soft diffused light",
    file: "zen-garden-crimson-maple-mist-2k-wallpaperz.jpg",
  },
  {
    title: "Outrun",
    prompt: "Retro synthwave supercar racing into a neon sunset, chrome grid road, purple and pink palette, 80s poster style",
    file: "synthwave-outrun-supercar-sunset-2k-wallpaperz.jpg",
  },
  {
    title: "Dunes at dusk",
    prompt: "Minimal desert dunes at dusk, smooth curved shadows, pastel sky, clean composition with lots of negative space",
    file: "minimal-desert-dunes-dusk-2k-wallpaperz.jpg",
  },
  {
    title: "Lantern sky",
    prompt: "Red torii gate under a sky full of floating paper lanterns, anime style, warm evening glow, detailed background art",
    file: "anime-torii-gate-sky-lanterns-2k-wallpaperz.jpg",
  },
]

/** Appended to the prompt on submit. The API only takes text, so a style is just words. */
export const STYLE_PRESETS = [
  { id: "photo", label: "Photographic", suffix: "photorealistic, natural light, high detail" },
  { id: "cinematic", label: "Cinematic", suffix: "cinematic lighting, dramatic atmosphere, wide angle, film still" },
  { id: "anime", label: "Anime", suffix: "anime style, detailed background art, vibrant colors" },
  { id: "painterly", label: "Painterly", suffix: "digital painting, visible brush strokes, matte painting" },
  { id: "minimal", label: "Minimal", suffix: "minimalist, clean shapes, soft gradients, lots of negative space" },
] as const

export type StyleId = (typeof STYLE_PRESETS)[number]["id"]

export const DEFAULT_NEGATIVE_PROMPT = "low quality, blurry, distorted, deformed, disfigured, bad anatomy, watermark, signature"
