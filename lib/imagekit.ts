"use client"
import ClientImageKit from "imagekit-javascript";

// Only initialize client-side ImageKit instance when in browser
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

/**
 * Get the full URL for an ImageKit image
 */
export function getImageUrl(path: string): string {
  // If the path is already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, prepend the ImageKit endpoint
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/starknight';
  return `${endpoint}/${path}`;
}

/**
 * Get a transformed URL for an ImageKit image
 */
export function getTransformedUrl(path: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  blur?: number;
} = {}): string {
  const baseUrl = getImageUrl(path);
  
  // If no transformations are needed, return the base URL
  if (!options.width && !options.height && !options.quality && !options.blur) {
    return baseUrl;
  }
  
  // Build the transformation string
  const transformations = [];
  
  if (options.width) transformations.push(`w-${options.width}`);
  if (options.height) transformations.push(`h-${options.height}`);
  if (options.quality) transformations.push(`q-${options.quality}`);
  if (options.blur) transformations.push(`bl-${options.blur}`);
  
  // If the URL already has transformations, we need to handle it differently
  if (baseUrl.includes('/tr:')) {
    // Extract the path and existing transformations
    const [base, pathWithTransform] = baseUrl.split('/tr:');
    const [existingTransform, imagePath] = pathWithTransform.split('/');
    
    // Combine existing and new transformations
    return `${base}/tr:${existingTransform},${transformations.join(',')}/${imagePath}`;
  }
  
  // For URLs without existing transformations
  const [endpoint, imagePath] = baseUrl.split('//')[1].split('/', 2);
  const remainingPath = baseUrl.split(`/${imagePath}/`)[1];
  
  return `https://${endpoint}/tr:${transformations.join(',')}/${imagePath}/${remainingPath}`;
}