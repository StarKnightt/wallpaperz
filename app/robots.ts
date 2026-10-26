import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// AI search, assistant and training crawlers are welcome on public pages (see
// /llms.txt). They get their own group because a crawler that matches a named
// group ignores '*', so the disallows must be repeated for them.
const AI_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
]

// /sign-in and /sign-up are deliberately NOT disallowed: they carry a noindex
// meta tag (see their layout.tsx), and Google can only honour that if it is
// allowed to fetch the page.
const DISALLOW = ['/api/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_BOTS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/wallpapers-sitemap.xml`],
  }
}
