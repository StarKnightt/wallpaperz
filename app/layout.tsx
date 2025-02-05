import "./globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import type React from "react" // Added import for React

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
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

