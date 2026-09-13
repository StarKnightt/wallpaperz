import "./globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import type React from "react"
import { SearchProvider } from "@/context/SearchContext"
import DomainGatedScripts from "@/components/DomainGatedScripts"
import { ClerkProvider } from '@clerk/nextjs'
import { ScrollProgress } from "@/components/ScrollProgress"
import BottomNav from "@/components/BottomNav"
import PwaRegister from "@/components/PwaRegister"
import InstallPrompt from "@/components/InstallPrompt"
import type { Metadata, Viewport } from "next"

const inter = Inter({ subsets: ["latin"] })

// Matches manifest.json theme_color/background_color (dark theme --background).
export const viewport: Viewport = {
  themeColor: '#020817',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  manifest: '/manifest.json',
  applicationName: 'Wallpaperz',
  appleWebApp: {
    capable: true,
    title: 'Wallpaperz',
    statusBarStyle: 'black-translucent',
  },
  title: {
    default: 'Wallpaperz - Premium HD & 4K Wallpapers',
    template: '%s | Wallpaperz'
  },
  description: 'Discover and download high-quality HD and 4K wallpapers for desktop, mobile, and tablet. Create custom AI-generated wallpapers for free.',
  keywords: [
    'wallpapers', 
    'HD wallpapers', 
    '4K wallpapers', 
    'desktop wallpapers', 
    'mobile wallpapers', 
    'AI wallpapers', 
    'free wallpapers',
    'abstract wallpapers',
    'anime wallpapers',
    'nature wallpapers',
    'space wallpapers',
    'minimalist wallpapers',
    'download wallpapers',
    'high quality wallpapers'
  ],
  authors: [{ name: 'Wallpaperz Team' }],
  creator: 'Wallpaperz',
  publisher: 'Wallpaperz',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  // www is the canonical host: the apex 301s here (middleware.ts), Search
  // Console sitemaps are registered under www, and Google already indexes www.
  metadataBase: new URL('https://www.wallpaperz.in'),
  // No root-level canonical on purpose: it is inherited by every route that
  // does not set its own, which made /about, /contact, /ai-generate etc. all
  // claim the homepage as their canonical. Each route sets alternates itself.
  openGraph: {
    title: 'Wallpaperz - Premium HD & 4K Wallpapers',
    description: 'Discover and download high-quality HD and 4K wallpapers for desktop, mobile, and tablet. Create custom AI-generated wallpapers for free.',
    url: 'https://www.wallpaperz.in',
    siteName: 'Wallpaperz',
    images: [
      {
        url: 'https://www.wallpaperz.in/theimage.png',
        width: 1200,
        height: 630,
        alt: 'Wallpaperz - Make your Day with fresh wallpapers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wallpaperz - Premium HD & 4K Wallpapers',
    description: 'Discover and download high-quality HD and 4K wallpapers for desktop, mobile, and tablet. Create custom AI-generated wallpapers for free.',
    images: ['https://www.wallpaperz.in/theimage.png'],
  },
  icons: {
    icon: [
      {
        url: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/web-app-manifest-192x192.png',
        color: '#5bbad5',
      },
      {
        rel: 'shortcut icon',
        url: '/web-app-manifest-192x192.png',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    nocache: true,
  },
  category: 'Technology',
  verification: {
    other: {
      // Pinterest website-claim verification; must be server-rendered static HTML
      'p:domain_verify': '5a51bc71c9a8b354e8b648a37980fa1c',
    },
  },
  other: {
    'og:logo': 'https://www.wallpaperz.in/web-app-manifest-512x512.png',
    // Next 15 emits the standard `mobile-web-app-capable`; older iOS (<17.4)
    // only honours the apple-prefixed one.
    'apple-mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Publisher ID is public (it's served in /ads.txt); env var only overrides.
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-9812963383908086'

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://ik.imagekit.io" />
          <link rel="dns-prefetch" href="https://ik.imagekit.io" />
          <meta property="og:image" content="https://www.wallpaperz.in/theimage.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="twitter:image" content="https://www.wallpaperz.in/theimage.png" />
          {/* Server-rendered so AdSense verification crawls see it; serves no ads by itself.
              The ad-serving script is injected client-side by DomainGatedScripts. */}
          <meta name="google-adsense-account" content={adsenseId} />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SearchProvider>
              <ScrollProgress />
              <div className="min-h-screen flex flex-col relative pb-16 lg:pb-0">
                <Header />
                <main className="flex-grow w-full max-w-[1920px] mx-auto">
                  {children}
                </main>
                <Footer />
                <BottomNav />
              </div>
              <InstallPrompt />
              <PwaRegister />
              <Toaster position="bottom-right" />
              {/* AdSense + GA4 + Clarity, hostname-gated so repo clones can't fire our IDs */}
              <DomainGatedScripts />
            </SearchProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

