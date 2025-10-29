/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/starknight/**'
      }
    ],
    domains: [
      'ik.imagekit.io',
      'lh3.googleusercontent.com', // Google profile image
      'avatars.githubusercontent.com', // GitHub profile image
      'images.pexels.com'  // Update this line
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://wallpaperz.in',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_PROD 
      : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV,
    CLERK_SECRET_KEY: process.env.NODE_ENV === 'production'
      ? process.env.CLERK_SECRET_KEY_PROD
      : process.env.CLERK_SECRET_KEY_DEV,
  },
  async redirects() {
    return [
      {
        source: '/api/sitemap.xml',
        destination: '/api/sitemap',
        permanent: true,
      },
    ]
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
