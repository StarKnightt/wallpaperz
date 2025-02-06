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
