import "./globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import type React from "react" // Added import for React
import { SearchProvider } from "@/context/SearchContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Wallpaperz - HD Wallpapers for Your Desktop",
  description: "Download high-quality wallpapers for your desktop and mobile devices. Browse through our collection of HD wallpapers across various categories.",
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
              <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
              <Footer />
            </div>
          </SearchProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}

