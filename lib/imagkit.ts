import ImageKit from "imagekit-javascript"

// Create and export the ImageKit instance for client-side use
export const imagekitClient = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT || "",
})

// Helper function to get optimized ImageKit URL
export function getImageKitUrl(src: string, width: number, height: number) {
  return imagekitClient.url({
    src: src,
    transformation: [
      {
        width: width.toString(),
        height: height.toString(),
        quality: "90",
        crop: "at_max",
      },
    ],
  })
}

