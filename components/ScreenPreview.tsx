"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Laptop, Smartphone, X } from "lucide-react"
import { DesktopChrome, LaptopFrame, LockScreenChrome, PhoneFrame } from "@/components/Devices"
import { imagekitLoader } from "@/lib/imagekit-loader"

type Device = "phone" | "desktop"

interface Props {
  open: boolean
  onClose: () => void
  imageUrl: string
  title: string
  isPortrait: boolean
}

/** Shows the wallpaper on a phone lock screen or a desktop, so people see the crop before downloading. */
export default function ScreenPreview({ open, onClose, imageUrl, title, isPortrait }: Props) {
  const [device, setDevice] = useState<Device>(isPortrait ? "phone" : "desktop")

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const src = imagekitLoader({ src: imageUrl, width: device === "phone" ? 828 : 1600, quality: 80 })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90 p-4 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} previewed on a ${device === "phone" ? "phone lock screen" : "desktop"}`}
        >
          <div
            className="flex rounded-full border border-white/15 bg-white/10 p-1 text-sm text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {([
              ["phone", Smartphone, "Phone"],
              ["desktop", Laptop, "Desktop"],
            ] as const).map(([key, Icon, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setDevice(key)}
                aria-pressed={device === key}
                className="relative flex items-center gap-2 rounded-full px-4 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {device === key && (
                  <motion.span layoutId="screen-preview-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", damping: 30, stiffness: 400 }} />
                )}
                <Icon className={`relative h-4 w-4 ${device === key ? "text-black" : ""}`} />
                <span className={`relative ${device === key ? "text-black" : ""}`}>{label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={device}
              initial={{ opacity: 0, y: 40, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 22, stiffness: 180 }}
              style={{ transformPerspective: 1200 }}
              className={device === "phone" ? "w-[min(18rem,40dvh)]" : "w-[min(56rem,92vw,110dvh)]"}
              onClick={(e) => e.stopPropagation()}
            >
              {device === "phone" ? (
                <PhoneFrame>
                  {/* eslint-disable-next-line @next/next/no-img-element -- sized via ImageKit loader */}
                  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover motion-safe:animate-screen-wake" />
                  <div className="absolute inset-0 motion-safe:animate-chrome-in">
                    <LockScreenChrome size={15} />
                  </div>
                </PhoneFrame>
              ) : (
                <LaptopFrame>
                  {/* eslint-disable-next-line @next/next/no-img-element -- sized via ImageKit loader */}
                  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover motion-safe:animate-screen-wake" />
                  <div className="absolute inset-0 motion-safe:animate-chrome-in">
                    <DesktopChrome size={13} />
                  </div>
                </LaptopFrame>
              )}
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
