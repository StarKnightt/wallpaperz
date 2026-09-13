import type { Metadata } from 'next'

// page.tsx is a client component and cannot export metadata.
export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms for using Wallpaperz: usage rights and limitations for downloaded and AI-generated wallpapers, accounts, and acceptable use.',
  alternates: { canonical: '/terms' },
  openGraph: { url: 'https://www.wallpaperz.in/terms', title: 'Terms of Service | Wallpaperz' },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
