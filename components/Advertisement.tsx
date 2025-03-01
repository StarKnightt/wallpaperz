"use client"
import { useEffect } from 'react'

interface AdProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle'
  layout?: 'in-article' | 'in-feed'
  className?: string
}

export default function Advertisement({ slot, format = 'auto', layout, className }: AdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`text-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9812963383908086"
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
      />
    </div>
  )
}