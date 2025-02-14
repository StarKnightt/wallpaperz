/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/starknight/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://wallpaperz.in',
  },
}

module.exports = nextConfig
