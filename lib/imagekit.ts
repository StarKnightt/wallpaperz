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
  // filePath from the ImageKit API starts with '/', avoid a double slash
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${endpoint}/${normalized}`;
}

/**
 * URL for downloading the ORIGINAL stored file, byte-for-byte.
 * ImageKit applies account-level compression even to untransformed URLs;
 * `tr=orig-true` bypasses it, and `ik-attachment=true` sets
 * Content-Disposition: attachment as a fallback if the URL is opened directly.
 */
export function getOriginalDownloadUrl(pathOrUrl: string): string {
  const baseUrl = getImageUrl(pathOrUrl);
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}tr=orig-true&ik-attachment=true`;
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