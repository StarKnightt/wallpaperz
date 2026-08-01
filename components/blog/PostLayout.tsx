import Link from 'next/link'
import { ChevronRight, Clock, Sparkles } from 'lucide-react'
import { getPost, relatedPosts, coverUrl } from '@/lib/blog/registry'

const BASE_URL = 'https://wallpaperz.in'

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function PostLayout({ slug, children }: { slug: string; children: React.ReactNode }) {
  const post = getPost(slug)
  if (!post) return null
  const related = relatedPosts(slug)

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: coverUrl(post),
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Wallpaperz", url: BASE_URL },
    publisher: { "@type": "Organization", name: "Wallpaperz", url: BASE_URL },
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${BASE_URL}/blog/${post.slug}` },
    ],
  }

  return (
    <article className="container mx-auto px-4 py-10 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground/80 truncate max-w-[220px] sm:max-w-none">{post.title}</span>
      </nav>

      <header className="mb-8">
        <p className="text-sm font-medium text-primary mb-2">{post.cluster}</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.minutes} min read
          </span>
        </div>
      </header>

      {/* eslint-disable-next-line @next/next/no-img-element -- ImageKit transform already sized */}
      <img
        src={coverUrl(post)}
        alt={post.coverAlt}
        className="w-full aspect-[2/1] object-cover rounded-xl mb-10"
        loading="eager"
        decoding="async"
      />

      <div className="blog-prose">{children}</div>

      <div className="mt-14 rounded-xl border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Free HD &amp; 4K wallpapers, zero watermarks
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse the gallery or generate a custom wallpaper with AI - everything on Wallpaperz is free.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            Browse Wallpapers
          </Link>
          <Link
            href="/ai-generate"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Generate with AI
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold mb-5">Keep Reading</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-lg border bg-card overflow-hidden hover:bg-accent transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- ImageKit transform already sized */}
                <img
                  src={coverUrl(p, 480)}
                  alt=""
                  className="w-full aspect-[16/9] object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-3">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                    {p.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">{p.minutes} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
