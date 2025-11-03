
export function getBlurDataURL(): string {
  const svg = `
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#2d2d2d;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="10" height="10" fill="url(#g)" />
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

export function getBlurDataURLClient(): string {
  const svg = `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" /><stop offset="50%" style="stop-color:#2d2d2d;stop-opacity:1" /><stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" /></linearGradient></defs><rect width="10" height="10" fill="url(#g)" /></svg>`
  
  if (typeof btoa !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
  
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

export interface ImageMetadata {
  width?: number
  height?: number
  size?: string
  format?: string
}

export async function getImageMetadata(imageUrl: string): Promise<ImageMetadata> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    const contentLength = response.headers.get('content-length')
    const contentType = response.headers.get('content-type')
    
    return {
      size: contentLength ? formatFileSize(parseInt(contentLength)) : undefined,
      format: contentType?.split('/')[1]?.toUpperCase()
    }
  } catch (error) {
    console.error('Failed to get image metadata:', error)
    return {}
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function getResolutionName(width: number, height: number): string {
  const pixels = width * height
  const maxDimension = Math.max(width, height)
  
  if (maxDimension >= 7680) return '8K'
  
  if (maxDimension >= 3840 || pixels >= 8000000) return '4K'
  
  if (maxDimension >= 2560 || (pixels >= 3500000 && pixels < 8000000)) return '2K'
  
  if (height >= 1080 || (pixels >= 2000000 && pixels < 3500000)) return '1080p'
  
  if (height >= 720 || (pixels >= 900000 && pixels < 2000000)) return '720p'
  
  if (height >= 480) return '480p'
  
  return 'SD'
}

