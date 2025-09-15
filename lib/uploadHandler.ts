import { NextRequest } from 'next/server'
import { imagekitServer } from './server/imagekit'

export async function handleUpload(file: File | Blob) {
  try {
    const buffer = await file.arrayBuffer()
    const fileName = `upload_${Date.now()}`
    
    const result = await imagekitServer.upload({
      file: Buffer.from(buffer),
      fileName,
      folder: 'uploads'
    })

    return {
      success: true,
      url: result.url,
      fileId: result.fileId
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload file')
  }
}      
