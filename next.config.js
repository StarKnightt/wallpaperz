/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ik.imagekit.io',
      'lh3.googleusercontent.com', // Google profile images
      'avatars.githubusercontent.com' // GitHub profile images
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://wallpaperz.in',
  },
  async redirects() {
    return []
  },
  async headers() {
    return []
  },
  // Add external links
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

module.exports = nextConfig
