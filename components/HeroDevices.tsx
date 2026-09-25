"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CyclingScreen, DesktopChrome, LaptopFrame, LockScreenChrome, PhoneFrame } from "@/components/Devices"

const IK = process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || "https://ik.imagekit.io/starknight"
const sized = (file: string, w: number) => `${IK}/wallpapers/${file}?tr=w-${w},q-70,f-auto`

const PHONE_WALLPAPERS = [
  "lone-figure-nebula-mountain-summit-mobile-wallpaperz.jpg",
  "astronaut-cherry-blossoms-space-mobile-wallpaperz.jpg",
  "tokyo-neon-street-fashion-girl-mobile-wallpaperz.jpg",
  "cozy-cabin-window-rain-fall-leaves-mobile-wallpaperz.jpg",
  "deep-purple-black-gradient-mobile-wallpaperz.jpg",
].map((f) => sized(f, 320))

const LAPTOP_WALLPAPERS = [
  "synthwave-outrun-supercar-sunset-2k-wallpaperz.jpg",
  "aurora-borealis-mountain-lake-2k-wallpaperz.jpg",
  "fantasy-floating-castle-dawn-2k-wallpaperz.jpg",
  "emerald-glass-flow-2k-wallpaperz.jpg",
  "anime-torii-gate-sky-lanterns-2k-wallpaperz.jpg",
].map((f) => sized(f, 560))

/**
 * Floating phone + laptop flanking the hero copy. Mounted only on xl screens so
 * phones never download the device wallpapers.
 */
export default function HeroDevices() {
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)")
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  if (!wide) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <motion.div
        className="absolute left-[3%] top-1/2 w-[150px] 2xl:left-[7%] 2xl:w-[170px]"
        initial={{ opacity: 0, x: -60, y: "-40%", rotate: -14 }}
        animate={{ opacity: 1, x: 0, y: "-50%", rotate: -8 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="motion-safe:animate-device-bob">
          <PhoneFrame>
            <CyclingScreen srcs={PHONE_WALLPAPERS} interval={4200} />
            <LockScreenChrome size={10} />
          </PhoneFrame>
          <div className="mx-auto mt-6 h-4 w-3/4 rounded-[50%] bg-black/40 blur-md motion-safe:animate-device-shadow" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-[1.5%] top-[54%] w-[270px] 2xl:right-[5%] 2xl:w-[320px]"
        initial={{ opacity: 0, x: 60, y: "-40%", rotate: 10 }}
        animate={{ opacity: 1, x: 0, y: "-50%", rotate: 5 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="motion-safe:animate-device-bob-slow">
          <LaptopFrame>
            <CyclingScreen srcs={LAPTOP_WALLPAPERS} interval={4200} offset={2100} />
            <DesktopChrome size={6.5} />
          </LaptopFrame>
          <div className="mx-auto mt-5 h-4 w-4/5 rounded-[50%] bg-black/40 blur-md motion-safe:animate-device-shadow" />
        </div>
      </motion.div>
    </div>
  )
}
