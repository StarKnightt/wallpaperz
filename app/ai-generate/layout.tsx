import type { Metadata } from 'next'

// page.tsx is a client component and cannot export metadata. The tool's
// headings, prompt suggestions and demo gallery are still server-rendered, so
// the page is indexable; it just needs its own canonical/title.
export const metadata: Metadata = {
  title: 'AI Wallpaper Generator - Create Custom 4K Wallpapers Free',
  description:
    'Describe the wallpaper you want and generate a custom HD or 4K wallpaper with AI in seconds. Free to use with a Wallpaperz account.',
  alternates: { canonical: '/ai-generate' },
  openGraph: {
    url: 'https://www.wallpaperz.in/ai-generate',
    title: 'AI Wallpaper Generator | Wallpaperz',
  },
}

export default function AiGenerateLayout({ children }: { children: React.ReactNode }) {
  return children
}
