import type { Metadata } from 'next'

// page.tsx is a client component and cannot export metadata.
export const metadata: Metadata = {
  title: 'Wallpaper License',
  description:
    'What you can and cannot do with wallpapers downloaded from Wallpaperz: personal use, attribution, redistribution and commercial use explained.',
  alternates: { canonical: '/license' },
  openGraph: { url: 'https://www.wallpaperz.in/license', title: 'Wallpaper License | Wallpaperz' },
}

export default function LicenseLayout({ children }: { children: React.ReactNode }) {
  return children
}
