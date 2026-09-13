import type { Metadata } from 'next'

// page.tsx is a client component and cannot export metadata; without this the
// route inherited the root layout's title and (previously) its canonical.
export const metadata: Metadata = {
  title: 'About',
  description:
    'Wallpaperz is a free library of curated HD and 4K wallpapers for desktop and mobile, plus an AI wallpaper generator. Learn who builds it and why.',
  alternates: { canonical: '/about' },
  openGraph: { url: 'https://www.wallpaperz.in/about', title: 'About Wallpaperz' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
