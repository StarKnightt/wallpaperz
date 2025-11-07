import "./globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import type React from "react"
import { SearchProvider } from "@/context/SearchContext"
import { Analytics } from "@vercel/analytics/react"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'
import { ScrollProgress } from "@/components/ScrollProgress"
import BottomNav from "@/components/BottomNav"
import LocalStorageWarning from "@/components/LocalStorageWarning"
import CookieConsent from "@/components/CookieConsent"
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
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
  metadataBase: new URL('https://wallpaperz.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Wallpaperz - Premium HD & 4K Wallpapers',
    description: 'Discover and download high-quality HD and 4K wallpapers for desktop, mobile, and tablet. Create custom AI-generated wallpapers for free.',
    url: 'https://wallpaperz.in',
    siteName: 'Wallpaperz',
    images: [
      {
        url: 'https://wallpaperz.in/theimage.png',
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
    images: ['https://wallpaperz.in/theimage.png'],
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
        url: '/web-app-manifest-192x192.png',
        sizes: '192x192',
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
  other: {
    'og:logo': 'https://wallpaperz.in/web-app-manifest-512x512.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <meta property="og:image" content="https://wallpaperz.in/theimage.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="twitter:image" content="https://wallpaperz.in/theimage.png" />
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
              <div className="min-h-screen flex flex-col relative pb-16 md:pb-0">
                <Header />
                <main className="flex-grow w-full max-w-[1920px] mx-auto">
                  {children}
                </main>
                <Footer />
                <BottomNav />
                <LocalStorageWarning />
                <CookieConsent />
              </div>
              <Toaster position="bottom-right" />
              <Analytics />
              <GoogleAnalytics gaId="G-FY8FQN2G9Z" />
              <Script strategy="afterInteractive" id="microsoft-clarity">
                {`
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "q9tt7wi9dk");
                `}
              </Script>
              <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-9812963383908086'}`}
                crossOrigin="anonymous"
                strategy="afterInteractive"
              />
            </SearchProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

