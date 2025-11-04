import { Metadata } from 'next'

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
  nature: "Bring the outdoors inside with breathtaking nature wallpapers featuring landscapes, mountains, forests, oceans, and wildlife photography.",
  space: "Explore the cosmos with stunning space wallpapers featuring planets, galaxies, nebulas, and astronomical wonders captured by NASA and space enthusiasts.",
  technology: "Embrace the digital age with tech-themed wallpapers featuring futuristic designs, circuit boards, coding, and technological innovation.",
  minimalist: "Keep it simple with minimalist wallpapers featuring clean designs, subtle colors, and elegant simplicity for a clutter-free aesthetic.",
  '4k': "Experience ultra-high definition with our premium 4K wallpapers delivering crystal-clear detail and stunning visual quality.",
  other: "Discover unique wallpapers that don't fit traditional categories, featuring diverse themes and creative concepts."
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug
  const category = slug.charAt(0).toUpperCase() + slug.slice(1)
  const description = categoryDescriptions[slug.toLowerCase()] || 
    `Browse our collection of high-quality ${category} wallpapers for desktop and mobile devices.`

  return {
    title: `${category} Wallpapers - Free HD & 4K Downloads | Wallpaperz`,
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

