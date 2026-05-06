import HomeClient from "./HomeClient"

const categories = [
  { name: "Abstract", slug: "abstract", description: "Geometric patterns, vibrant colors, and modern artistic designs" },
  { name: "Anime", slug: "anime", description: "Characters, epic scenes, and artwork from popular anime series" },
  { name: "Art", slug: "art", description: "Paintings, illustrations, and creative masterpieces" },
  { name: "Cars", slug: "cars", description: "Supercars, classic vehicles, and automotive photography" },
  { name: "City", slug: "city", description: "Skylines, architecture, and metropolitan landscapes" },
  { name: "Fantasy", slug: "fantasy", description: "Dragons, mythical creatures, and enchanted worlds" },
  { name: "Nature", slug: "nature", description: "Landscapes, mountains, forests, and wildlife" },
  { name: "Space", slug: "space", description: "Planets, galaxies, nebulas, and astronomical wonders" },
  { name: "Technology", slug: "technology", description: "Futuristic designs, circuits, and digital innovation" },
  { name: "Minimalist", slug: "minimalist", description: "Clean designs, subtle colors, and elegant simplicity" },
  { name: "4K", slug: "4k", description: "Ultra-high definition wallpapers with crystal-clear detail" },
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
