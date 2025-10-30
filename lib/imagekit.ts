"use client"
import ClientImageKit from "imagekit-javascript";

export const imagekitClient = typeof window !== "undefined" 
  ? new ClientImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || "",
    })
  : null;

export const publicConfig = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || '',
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''
};

export function getImageUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight';
  return `${endpoint}/${path}`;
}

export function getTransformedUrl(path: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  blur?: number;
} = {}): string {
  const baseUrl = getImageUrl(path);
  
  if (!options.width && !options.height && !options.quality && !options.blur) {
    return baseUrl;
  }
  
  const transformations = [];
  
  if (options.width) transformations.push(`w-${options.width}`);
  if (options.height) transformations.push(`h-${options.height}`);
  if (options.quality) transformations.push(`q-${options.quality}`);
  if (options.blur) transformations.push(`bl-${options.blur}`);
  
  if (baseUrl.includes('/tr:')) {
    const [base, pathWithTransform] = baseUrl.split('/tr:');
    const [existingTransform, imagePath] = pathWithTransform.split('/');
    
    return `${base}/tr:${existingTransform},${transformations.join(',')}/${imagePath}`;
  }
  
  const [endpoint, imagePath] = baseUrl.split('//')[1].split('/', 2);
  const remainingPath = baseUrl.split(`/${imagePath}/`)[1];
  
  return `https://${endpoint}/tr:${transformations.join(',')}/${imagePath}/${remainingPath}`;
}