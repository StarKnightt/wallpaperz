import { NextResponse } from 'next/server';

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
    '/profile',
    '/license',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastmod: new Date().toISOString().split('T')[0],
  }));
  
  // Fetch categories from ImageKit dynamically
  let categoryPages: Array<{ url: string; lastmod: string }> = [];
  try {
    const response = await fetch(`${baseUrl}/api/wallpapers/sync`);
    const data = await response.json();
    
    if (data.success && data.wallpapers) {
      const categories = [...new Set(data.wallpapers.map((w: any) => w.category))] as string[];
      categoryPages = categories.map((category) => ({
        url: `${baseUrl}/category/${category.toLowerCase()}`,
        lastmod: new Date().toISOString().split('T')[0],
      }));
    }
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error);
  }
  
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