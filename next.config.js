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
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_PROD 
      : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV,
    CLERK_SECRET_KEY: process.env.NODE_ENV === 'production'
      ? process.env.CLERK_SECRET_KEY_PROD
      : process.env.CLERK_SECRET_KEY_DEV,
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
