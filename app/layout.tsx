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
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: 'Wallpaperz - Premium HD & 4K Wallpapers',
    template: '%s | Wallpaperz'
  },
  description: 'Discover and download high-quality HD and 4K wallpapers for desktop, mobile, and tablet. Create custom AI-generated wallpapers for free.',
  keywords: ['wallpapers', 'HD wallpapers', '4K wallpapers', 'desktop wallpapers', 'mobile wallpapers', 'AI wallpapers', 'free wallpapers'],
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
        url: '/og_image.png',
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
    images: ['/og_image.png'],
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
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
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
      {
        rel: 'shortcut icon',
        url: '/favicon.ico',
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
    google: 'your-google-verification-code',
    // yandex: "YOUR_YANDEX_VERIFICATION", // Optional
    // bing: "YOUR_BING_VERIFICATION", // Optional
  }
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
          <meta name="google-adsense-account" content="ca-pub-9812963383908086" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9812963383908086"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
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
            </SearchProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

