import type { Metadata } from 'next'

// page.tsx is a client component and cannot export metadata.
export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Questions, wallpaper requests, takedowns or partnership ideas: reach the Wallpaperz team by email or on Discord.',
  alternates: { canonical: '/contact' },
  openGraph: { url: 'https://www.wallpaperz.in/contact', title: 'Contact Wallpaperz' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
