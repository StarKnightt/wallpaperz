import { DEVICES, Device } from "@/lib/devices"

export type ScreenResult = { w: number; h: number; matches: Device[]; closest: Device | null }

/** Physical screen pixels (CSS size × devicePixelRatio), matched against the device list. Client only. */
export function detectScreen(): ScreenResult {
  const dpr = window.devicePixelRatio || 1
  let w = Math.round(window.screen.width * dpr)
  let h = Math.round(window.screen.height * dpr)
  // Phones report portrait, desktops landscape; normalise to how the device is used
  const touch = window.matchMedia("(pointer: coarse)").matches
  const small = Math.min(window.screen.width, window.screen.height) < 600
  if (touch && small && w > h) [w, h] = [h, w]
  if (!(touch && small) && h > w) [w, h] = [h, w]

  const near = (a: number, b: number) => Math.abs(a - b) <= 4
  const matches = DEVICES.filter((d) => near(d.width, w) && near(d.height, h))
  const score = (d: Device) => Math.abs(d.width / d.height - w / h) * 4 + Math.abs(d.width * d.height - w * h) / (w * h)
  const closest = matches.length
    ? null
    : DEVICES.filter((d) => d.height > d.width === h > w).reduce<Device | null>(
        (best, d) => (!best || score(d) < score(best) ? d : best),
        null
      )
  return { w, h, matches, closest }
}
