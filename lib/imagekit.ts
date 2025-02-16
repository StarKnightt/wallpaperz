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

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}/${path}`;
}