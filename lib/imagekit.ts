"use client"
import ClientImageKit from "imagekit-javascript";

// Only initialize client-side ImageKit instance when in browser
export const imagekitClient = typeof window !== "undefined" 
  ? new ClientImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || "",
    })
  : null;

// Public config that can be used anywhere
export const publicConfig = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || '',
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''
};

// Simple URL helper function
export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}/${path}`;
}

// If you need server-side ImageKit functionality, create a separate file
// like lib/server/imagekit.ts for those operations