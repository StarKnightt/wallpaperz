import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { handleUpload } from '@/lib/uploadHandler'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const file = data.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Invalid file upload" },
        { status: 400 }
      )
    }

    // Simply return a success response with the file info
    return NextResponse.json({
      success: true,
      url: URL.createObjectURL(file),
      fileName: file instanceof File ? file.name : `upload-${Date.now()}`
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
