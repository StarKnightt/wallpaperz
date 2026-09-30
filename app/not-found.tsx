import type { Metadata } from "next"
import NotFoundView from "@/components/NotFoundView"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page doesn't exist, or the wallpaper was removed.",
}

export default function NotFound() {
  return <NotFoundView />
}
