import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Read the sitemap XML file from the public directory
  const sitemap = fs.readFileSync(
    path.join(process.cwd(), 'public', 'sitemap.xml'),
    'utf-8'
  );

  // Return the XML with proper content type
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 