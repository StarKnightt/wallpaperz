import { Metadata } from 'next'

// The page itself is a client component, so segment config lives here.
// generateStaticParams opts the route into static generation (it was fully
// dynamic before, SSR'd on every crawler hit); revalidate makes it ISR.
export const revalidate = 3600

export function generateStaticParams() {
  return Object.keys(categoryDescriptions).map((slug) => ({ slug }))
}

type Props = {
  params: { slug: string }
}

const categoryDescriptions: Record<string, string> = {
  abstract: "Discover stunning abstract wallpapers featuring geometric patterns, vibrant colors, and modern artistic designs. Perfect for adding a contemporary touch to your desktop or mobile device.",
  anime: "Browse our collection of high-quality anime wallpapers featuring your favorite characters, epic scenes, and stunning artwork from popular anime series.",
  art: "Explore beautiful artistic wallpapers showcasing paintings, illustrations, and creative masterpieces from talented artists around the world.",
  cars: "Rev up your screens with amazing car wallpapers featuring supercars, classic vehicles, racing scenes, and automotive photography.",
  city: "Experience urban beauty with our city wallpapers showcasing skylines, architecture, streets, and metropolitan landscapes from around the globe.",
  fantasy: "Immerse yourself in magical realms with fantasy wallpapers featuring dragons, mythical creatures, enchanted forests, and otherworldly scenes.",
  gaming: "Level up your screen with gaming wallpapers featuring iconic characters, epic scenes, and artwork from the biggest video game titles.",
  nature: "Bring the outdoors inside with breathtaking nature wallpapers featuring landscapes, mountains, forests, oceans, and wildlife photography.",
  people: "Stunning portrait wallpapers featuring celebrities, K-pop idols, and beautiful photography in HD and 4K quality.",
  space: "Explore the cosmos with stunning space wallpapers featuring planets, galaxies, nebulas, and astronomical wonders captured by NASA and space enthusiasts.",
  technology: "Embrace the digital age with tech-themed wallpapers featuring futuristic designs, circuit boards, coding, and technological innovation.",
  minimalist: "Keep it simple with minimalist wallpapers featuring clean designs, subtle colors, and elegant simplicity for a clutter-free aesthetic.",
  mobile: "Vertical 9:16 phone wallpapers sized perfectly for your mobile screen. HD and 4K portrait backgrounds for iPhone and Android.",
  '4k': "Experience ultra-high definition with our premium 4K wallpapers delivering crystal-clear detail and stunning visual quality.",
  other: "Discover unique wallpapers that don't fit traditional categories, featuring diverse themes and creative concepts."
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug
  const category = slug.charAt(0).toUpperCase() + slug.slice(1)
  const description = categoryDescriptions[slug.toLowerCase()] || 
    `Browse our collection of high-quality ${category} wallpapers for desktop and mobile devices.`

  return {
    // Root layout template appends "| Wallpaperz"
    title: `${category} Wallpapers - Free HD & 4K Downloads`,
    description,
    keywords: [
      `${category} wallpapers`,
      `${category} backgrounds`,
      `HD ${category} wallpapers`,
      `4K ${category} wallpapers`,
      `free ${category} wallpapers`,
      `${category} desktop wallpapers`,
      `${category} mobile wallpapers`
    ],
    openGraph: {
      title: `${category} Wallpapers - Free HD & 4K Downloads`,
      description,
      url: `https://wallpaperz.in/category/${slug}`,
      siteName: 'Wallpaperz',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category} Wallpapers - Free HD & 4K Downloads`,
      description,
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

