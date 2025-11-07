"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"
import Link from "next/link"

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("wallpaperz_cookie_consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("wallpaperz_cookie_consent", "accepted")
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem("wallpaperz_cookie_consent", "declined")
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] max-w-sm w-[calc(100%-2rem)] md:w-96"
        >
          <div className="relative bg-background/95 backdrop-blur-lg border rounded-xl shadow-2xl p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Cookie className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold mb-1">Cookie Notice</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We use cookies for auth and functionality.{" "}
                    <Link href="/privacy" className="underline hover:text-primary">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={declineCookies}
                  className="flex-1 h-8 text-xs"
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={acceptCookies}
                  className="flex-1 h-8 text-xs"
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

