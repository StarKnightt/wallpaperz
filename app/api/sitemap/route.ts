import { NextResponse } from 'next/server';
import { allWallpapers } from '@/data/wallpapers';

export async function GET() {
  const baseUrl = 'https://wallpaperz.in';
  
  // Base URLs
  const staticPages = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    '/ai-generate',
    '/gallery',
    '/profile',
    '/license',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastmod: new Date().toISOString().split('T')[0],
  }));
  
  // Get categories from wallpapers with proper typing
  const categories = [...new Set(allWallpapers.map(w => w.category))];
  const categoryPages = categories.map((category: string) => ({
    url: `${baseUrl}/category/${category.toLowerCase()}`,
    lastmod: new Date().toISOString().split('T')[0],
  }));
  
  // Combine all URLs
  const allPages = [...staticPages, ...categoryPages];
  
  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.url === baseUrl ? 'daily' : 'weekly'}</changefreq>
    <priority>${page.url === baseUrl ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 