/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile images
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub profile images
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Clerk user avatars
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  // Vercel serves /public files with `max-age=0, must-revalidate`, so browsers
  // send a conditional GET for these on every page load and each 304 counts
  // against the edge-request quota. These assets never change in place (any
  // change ships under a new filename), so mark them immutable.
  async headers() {
    return [
      {
        source: '/:file(favicon.png|theimage.png|apple-touch-icon.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png|web-app-manifest-192x192-maskable.png|web-app-manifest-512x512-maskable.png)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Manifest content can change, so cache for a day instead of forever
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        // Service worker must always be revalidated so a new deploy takes over
        // promptly (the browser also caps SW script caching at 24h).
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/offline.html',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
        ],
      },
    ]
  },
  // Page 1 of every paginated list is the bare list URL; /page/1 variants
  // 308 there so there is exactly one canonical URL per page.
  async redirects() {
    return [
      { source: '/page/1', destination: '/', permanent: true },
      { source: '/category/:slug/page/1', destination: '/category/:slug', permanent: true },
      { source: '/color/:slug/page/1', destination: '/color/:slug', permanent: true },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/StarKnightt',
      },
      {
        source: '/twitter',
        destination: 'https://x.com/Star_Knight12',
      },
    ]
  }
}

module.exports = withBundleAnalyzer(nextConfig)
