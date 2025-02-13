/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['wallpaperz.in', 'ik.imagekit.io'],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://wallpaperz.in',
  },
}

module.exports = nextConfig
