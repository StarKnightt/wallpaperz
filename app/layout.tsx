import "./globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import type React from "react" // Added import for React
import { SearchProvider } from "@/context/SearchContext"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'Wallpaperz',
  description: 'Discover and download high-quality wallpapers',
  metadataBase: new URL('https://wallpaperz.in'),
  openGraph: {
    title: 'Wallpaperz',
    description: 'Discover and download high-quality wallpapers',
    url: 'https://wallpaperz.in',
    siteName: 'Wallpaperz',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wallpaperz',
    description: 'Discover and download high-quality wallpapers',
    site: '@wallpaperz',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SearchProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow w-full max-w-[1920px] mx-auto">
                {children}
              </main>
              <Footer />
            </div>
          </SearchProvider>
          <Toaster position="top-center" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

