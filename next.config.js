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
}

module.exports = nextConfig
