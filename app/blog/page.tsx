import { Metadata } from 'next'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { BLOG_POSTS, coverUrl, BlogCluster } from '@/lib/blog/registry'

const BASE_URL = 'https://wallpaperz.in'

export const metadata: Metadata = {
  title: 'Wallpaper Guides & Tips',
  description:
    'Practical guides on wallpapers: the right resolutions for every device, live wallpapers on Windows 11, dual monitor setups, AI wallpaper prompts, and more.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Wallpaper Guides & Tips | Wallpaperz',
    description:
      'Practical guides on wallpapers: resolutions, live wallpapers, dual monitor setups, AI generation and more.',
    url: `${BASE_URL}/blog`,
  },
}

const CLUSTER_ORDER: BlogCluster[] = ['How-To Guides', 'Device Guides', 'Inspiration']

const CLUSTER_TAGLINES: Record<BlogCluster, string> = {
  'How-To Guides': 'Step-by-step fixes and setups for every platform',
  'Device Guides': 'Get the exact right wallpaper for your screen',
  Inspiration: 'Styles, trends, and hand-picked collections',
}

export default function BlogIndexPage() {
  const blogData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Wallpaperz Blog",
    description: "Guides and tips on wallpapers, screen resolutions, and device customization.",
    url: `${BASE_URL}/blog`,
    publisher: { "@type": "Organization", name: "Wallpaperz", url: BASE_URL },
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${BASE_URL}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogData) }}
      />

      <header className="max-w-2xl mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Wallpaper Guides &amp; Tips</h1>
        <p className="text-muted-foreground mt-3">
          Everything about making your screens look good: the right resolution for your device,
          live wallpapers, multi-monitor setups, and getting the most out of AI generation.
        </p>
      </header>

      {CLUSTER_ORDER.map((cluster) => {
        const posts = BLOG_POSTS.filter((p) => p.cluster === cluster)
        if (posts.length === 0) return null
        return (
          <section key={cluster} className="mb-12">
            <h2 className="text-xl font-semibold">{cluster}</h2>
            <p className="text-sm text-muted-foreground mb-5">{CLUSTER_TAGLINES[cluster]}</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-md hover:bg-accent/50 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- ImageKit transform already sized */}
                  <img
                    src={coverUrl(post, 640)}
                    alt={post.coverAlt}
                    className="w-full aspect-[16/9] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.description}</p>
                    <p className="text-xs text-muted-foreground mt-3 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.minutes} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
