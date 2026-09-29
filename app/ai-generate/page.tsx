"use client"

import { useAuth } from "@clerk/nextjs"
import AiLanding from "@/components/ai/AiLanding"
import Studio from "@/components/ai/Studio"

function StudioSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-16 rounded bg-muted" />
      <div className="mt-6 h-9 w-72 max-w-full rounded-md bg-muted" />
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-4 lg:col-span-5">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-44 rounded-xl bg-muted" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => <div key={i} className="h-8 w-20 rounded-lg bg-muted" />)}
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="aspect-video rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function AIGeneratePage() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return <StudioSkeleton />
  if (!isSignedIn) return <AiLanding />
  return <Studio />
}
