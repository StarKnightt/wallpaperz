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
        source: '/:file(favicon.png|theimage.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png)',
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
