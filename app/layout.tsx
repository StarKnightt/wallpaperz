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

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'Wallpaperz - High Quality Wallpapers for Desktop and Mobile',
  description: 'Download free HD and 4K wallpapers for your desktop and mobile. Browse through our collection of high-quality wallpapers including Nature, Abstract, Space, and Anime themes.',
  rights: 'Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Images sourced from Pexels, Pixabay, and Unsplash under their respective licenses.',
  license: 'CC BY-SA 4.0',
  metadataBase: new URL('https://wallpaperz.in'),
  openGraph: {
    title: 'Wallpaperz - High Quality Wallpapers',
    description: 'Download free HD and 4K wallpapers for your desktop and mobile. Browse through our curated collection of stunning wallpapers.',
    url: 'https://wallpaperz.in',
    siteName: 'Wallpaperz',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wallpaperz - High Quality Wallpapers'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wallpaperz - High Quality Wallpapers',
    description: 'Download free HD and 4K wallpapers for your desktop and mobile',
    site: '@wallpaperz',
    creator: '@wallpaperz',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      {
        url: '/favicon.png',
        sizes: '32x32',
        type: 'image/ico',
      },
      {
        url: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/favicon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  keywords: [
    'wallpapers',
    'HD wallpapers',
    '4K wallpapers',
    'desktop backgrounds',
    'mobile wallpapers',
    'free wallpapers',
    'nature wallpapers',
    'abstract wallpapers',
    'space wallpapers',
    'anime wallpapers',
    'high quality wallpapers',
    'desktop wallpapers',
    'phone wallpapers'
  ],
  alternates: {
    canonical: 'https://wallpaperz.in',
    languages: {
      'en-US': 'https://wallpaperz.in'
    }
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
    google: "P4kzrFl_om0QoNgXYaGqZ1Vv6W3wAiZeVfoolatuWnU",
    yandex: "YOUR_YANDEX_VERIFICATION", // Optional
    bing: "YOUR_BING_VERIFICATION", // Optional
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

