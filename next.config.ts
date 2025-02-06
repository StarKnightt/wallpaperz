import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/starknight/**'
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true, // This will ignore ESLint errors during build
  }
}

export default nextConfig