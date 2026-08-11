import HomeClient from "./HomeClient"
import { BLOG_POSTS } from "@/lib/blog/registry"

// Colors with enough inventory for a landing page (see lib/colors.ts + tag-colors script)
const colorLinks = [
  { name: "Dark", slug: "dark", swatch: "#0a0a0f" },
  { name: "Black", slug: "black", swatch: "#000000" },
  { name: "Blue", slug: "blue", swatch: "#2563eb" },
  { name: "Purple", slug: "purple", swatch: "#8b5cf6" },
  { name: "Gray", slug: "gray", swatch: "#6b7280" },
  { name: "Green", slug: "green", swatch: "#22c55e" },
  { name: "Orange", slug: "orange", swatch: "#f97316" },
  { name: "Teal", slug: "teal", swatch: "#14b8a6" },
  { name: "Red", slug: "red", swatch: "#ef4444" },
  { name: "Pink", slug: "pink", swatch: "#ec4899" },
  { name: "White", slug: "white", swatch: "#f8fafc" },
  { name: "Yellow", slug: "yellow", swatch: "#eab308" },
]

const categories = [
  { name: "Abstract", slug: "abstract", description: "Geometric patterns, vibrant colors, and modern artistic designs" },
  { name: "Anime", slug: "anime", description: "Characters, epic scenes, and artwork from popular anime series" },
  { name: "Art", slug: "art", description: "Paintings, illustrations, and creative masterpieces" },
  { name: "Cars", slug: "cars", description: "Supercars, classic vehicles, and automotive photography" },
  { name: "City", slug: "city", description: "Skylines, architecture, and metropolitan landscapes" },
  { name: "Fantasy", slug: "fantasy", description: "Dragons, mythical creatures, and enchanted worlds" },
  { name: "Gaming", slug: "gaming", description: "Iconic characters and scenes from your favorite video games" },
  { name: "Nature", slug: "nature", description: "Landscapes, mountains, forests, and wildlife" },
  { name: "People", slug: "people", description: "Celebrities, idols, and stunning portrait photography" },
  { name: "Space", slug: "space", description: "Planets, galaxies, nebulas, and astronomical wonders" },
  { name: "Technology", slug: "technology", description: "Futuristic designs, circuits, and digital innovation" },
  { name: "Minimalist", slug: "minimalist", description: "Clean designs, subtle colors, and elegant simplicity" },
  { name: "Mobile", slug: "mobile", description: "Vertical 9:16 wallpapers sized for your phone screen" },
]

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Wallpaperz",
  url: "https://wallpaperz.in",
  description: "Browse and download free HD & 4K wallpapers for desktop and mobile. Generate custom wallpapers with AI.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://wallpaperz.in/?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

const collectionData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free HD & 4K Wallpapers",
  description: "Curated collection of high-resolution wallpapers across categories like nature, anime, space, minimalist, and more.",
  url: "https://wallpaperz.in",
  provider: {
    "@type": "Organization",
    name: "Wallpaperz",
    url: "https://wallpaperz.in",
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }}
      />

      <HomeClient />

      {/* Server-rendered content for search engines */}
      <section className="container mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Browse Wallpapers by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold text-lg">{cat.name} Wallpapers</h3>
              <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
            </a>
          ))}
        </div>
        <h2 className="text-2xl font-bold mt-12 mb-6">Browse Wallpapers by Color</h2>
        <div className="flex flex-wrap gap-3">
          {colorLinks.map((color) => (
            <a
              key={color.slug}
              href={`/color/${color.slug}`}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors"
            >
              <span
                className="h-3.5 w-3.5 rounded-full border border-border"
                style={{ backgroundColor: color.swatch }}
                aria-hidden="true"
              />
              {color.name} Wallpapers
            </a>
          ))}
        </div>

        <div className="mt-12 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold mb-6">Wallpaper Guides &amp; Tips</h2>
          <a href="/blog" className="text-sm text-primary hover:underline shrink-0">
            View all guides
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLOG_POSTS.slice(0, 6).map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold leading-snug">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 text-sm text-muted-foreground max-w-3xl">
          <p>
            Wallpaperz offers free HD and 4K wallpapers for desktop, laptop, tablet, and mobile devices.
            Browse our curated collection or use AI to generate your own custom wallpapers.
            All wallpapers are available for free download in their original resolution.
          </p>
        </div>
      </section>
    </>
  )
}
