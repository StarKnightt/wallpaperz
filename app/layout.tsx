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

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'Wallpaperz',
  description: 'Discover and download high-quality wallpapers',
  rights: 'Images sourced from Pexels, Pixabay, and Unsplash under free-to-use licenses',
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SearchProvider>
              <ScrollProgress />
              <div className="min-h-screen flex flex-col relative">
                <Header />
                <main className="flex-grow w-full max-w-[1920px] mx-auto">
                  {children}
                </main>
                <Footer />
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

