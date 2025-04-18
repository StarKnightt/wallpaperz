'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error') || 'Unknown error'

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-background p-8 shadow-lg">
        <h1 className="mb-4 text-xl font-bold">Authentication Error</h1>
        <div className="text-muted-foreground">
          <p>An error occurred during authentication: {error}</p>
          <p className="mt-4">
            Please try again or contact support if the problem persists.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-background p-8 shadow-lg">
          <h1 className="mb-4 text-xl font-bold">Loading...</h1>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
