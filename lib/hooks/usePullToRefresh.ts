"use client"
import { useEffect, useState, useRef } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
  enabled?: boolean
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  enabled = true
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    let isScrollable = false

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0) {
        isScrollable = true
        return
      }
      isScrollable = false
      startY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrollable || isRefreshing) return
      
      currentY.current = e.touches[0].clientY
      const distance = currentY.current - startY.current

      if (distance > 0 && window.scrollY === 0) {
        setPullDistance(Math.min(distance, threshold * 1.5))
        
        if (distance > 10) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = async () => {
      if (isScrollable || isRefreshing) return

      if (pullDistance > threshold) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } catch (error) {
          console.error('Refresh failed:', error)
        } finally {
          setIsRefreshing(false)
        }
      }
      
      setPullDistance(0)
      startY.current = 0
      currentY.current = 0
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onRefresh, threshold, enabled, isRefreshing, pullDistance])

  const pullProgress = Math.min((pullDistance / threshold) * 100, 100)

  return {
    isRefreshing,
    pullDistance,
    pullProgress,
    showIndicator: pullDistance > 0
  }
}

