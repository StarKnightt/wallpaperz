"use client"
import { Loader2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PullToRefreshProps {
  isRefreshing: boolean
  pullDistance: number
  pullProgress: number
  showIndicator: boolean
}

export default function PullToRefresh({
  isRefreshing,
  pullDistance,
  pullProgress,
  showIndicator
}: PullToRefreshProps) {
  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center"
          style={{ paddingTop: `${Math.min(pullDistance * 0.5, 40)}px` }}
        >
          <div className="bg-background/95 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Refreshing...</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: pullProgress * 3.6 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </motion.div>
                <span className="text-sm font-medium text-muted-foreground">
                  {pullProgress >= 100 ? 'Release to refresh' : 'Pull to refresh'}
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

