import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /sign-in and /sign-up are deliberately NOT disallowed: they carry a
      // noindex meta tag (see their layout.tsx), and Google can only honour
      // that if it is allowed to fetch the page.
      disallow: ['/api/'],
    },
    sitemap: [
      'https://www.wallpaperz.in/sitemap.xml',
      'https://www.wallpaperz.in/wallpapers-sitemap.xml',
    ],
  }
}
