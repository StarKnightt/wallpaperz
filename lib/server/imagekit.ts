import ImageKit from "imagekit";

// Initialize ImageKit with environment variables
export const imagekitServer = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || ""
});

/**
 * Upload an image to ImageKit
 */
export async function uploadImage(file: Buffer, fileName: string, folder: string = 'uploads') {
  try {
    const response = await imagekitServer.upload({
      file,
      fileName,
      folder,
    });
    
    return {
      success: true,
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    };
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete an image from ImageKit
 */
export async function deleteImage(fileId: string) {
  try {
    await imagekitServer.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from ImageKit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
