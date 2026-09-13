import type { Metadata } from 'next'

// page.tsx is a client component and cannot export metadata.
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Wallpaperz handles your data: what we collect, cookies and local storage, third-party services, and your choices.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: 'https://www.wallpaperz.in/privacy', title: 'Privacy Policy | Wallpaperz' },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
