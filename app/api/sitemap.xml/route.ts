import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const sitemap = fs.readFileSync(
    path.join(process.cwd(), 'public', 'sitemap.xml'),
    'utf-8'
  );

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 