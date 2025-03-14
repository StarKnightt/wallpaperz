// Define the interface for images stored in localStorage
export interface LocalStorageImage {
  id: string;
  imageUrl: string;
  prompt?: string;
  createdAt: string;
}

// Maximum number of images to store
const MAX_STORED_IMAGES = 20;

/**
 * Save a generated image to localStorage
 */
export function saveGeneratedImage({ id, imageUrl, prompt, createdAt }: LocalStorageImage): void {
  try {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Get existing images
    const existingImagesJson = localStorage.getItem('wallpaperz_generated_images');
    let images: LocalStorageImage[] = [];
    
    if (existingImagesJson) {
      try {
        images = JSON.parse(existingImagesJson);
        
        // Ensure it's an array
        if (!Array.isArray(images)) {
          images = [];
        }
      } catch (e) {
        console.error('Error parsing stored images, resetting:', e);
        images = [];
      }
    }
    
    // Check if image with this ID already exists
    const existingIndex = images.findIndex(img => img.id === id);
    
    if (existingIndex >= 0) {
      // Update existing image
      images[existingIndex] = { id, imageUrl, prompt, createdAt };
    } else {
      // Add new image to the beginning
      images.unshift({ id, imageUrl, prompt, createdAt });
      
      // Limit the number of stored images
      if (images.length > MAX_STORED_IMAGES) {
        images = images.slice(0, MAX_STORED_IMAGES);
      }
    }
    
    // Save back to localStorage
    localStorage.setItem('wallpaperz_generated_images', JSON.stringify(images));
    
    // Set flag that a new image was generated (for notifications)
    localStorage.setItem('wallpaperz_latest_generation', 'true');
  } catch (error) {
    console.error('Error saving image to localStorage:', error);
  }
}

/**
 * Get all generated images from localStorage
 */
export function getGeneratedImages(): LocalStorageImage[] {
  try {
    // Only run on client side
    if (typeof window === 'undefined') return [];
    
    const imagesJson = localStorage.getItem('wallpaperz_generated_images');
    if (!imagesJson) return [];
    
    const images = JSON.parse(imagesJson);
    return Array.isArray(images) ? images : [];
  } catch (error) {
    console.error('Error retrieving images from localStorage:', error);
    return [];
  }
}

/**
 * Delete a generated image from localStorage
 */
export function deleteGeneratedImage(id: string): void {
  try {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const imagesJson = localStorage.getItem('wallpaperz_generated_images');
    if (!imagesJson) return;
    
    let images = JSON.parse(imagesJson);
    if (!Array.isArray(images)) return;
    
    images = images.filter((img: LocalStorageImage) => img.id !== id);
    localStorage.setItem('wallpaperz_generated_images', JSON.stringify(images));
  } catch (error) {
    console.error('Error deleting image from localStorage:', error);
  }
}

/**
 * Clear all generated images from localStorage
 */
export function clearGeneratedImages(): void {
  try {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('wallpaperz_generated_images');
  } catch (error) {
    console.error('Error clearing images from localStorage:', error);
  }
} 