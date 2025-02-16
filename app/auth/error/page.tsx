'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="container mx-auto max-w-md mt-20 p-6">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">
          {error === 'Configuration' 
            ? 'There is a problem with the server configuration.'
            : 'An error occurred during authentication.'}
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
