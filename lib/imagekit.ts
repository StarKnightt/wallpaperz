import ImageKit from "imagekit-javascript";
import ServerImageKit from "imagekit";

// Client-side ImageKit instance
export const imagekitClient = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

// Server-side ImageKit instance
export const imagekitServer = new ServerImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
});

export const getImageKitUrl = (url: string, width?: number, height?: number) => {
  if (!url) return '';
  
  // If the URL is already an ImageKit URL, return it as is
  if (url.includes('ik.imagekit.io')) {
    return url;
  }

  // If width and height are provided, add transformation
  const transformation = width && height ? `tr:w-${width},h-${height}` : '';
  
  return url;
}

export async function handleUpload(file: File | Blob) {
  try {
    return {
      success: true,
      url: URL.createObjectURL(file),
      fileId: Date.now().toString()
    }
  } catch (error) {
    throw new Error('Failed to upload file')
  }
}