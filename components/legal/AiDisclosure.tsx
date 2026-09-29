import Link from "next/link"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AiDisclosure({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-1.5 text-xs text-muted-foreground", className)}>
      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        AI-generated image, created by Stability AI from your prompt. It may contain errors or resemble existing
        works, so don&apos;t present it as a real photo.{" "}
        <Link href="/ai-transparency" className="underline underline-offset-2 hover:text-foreground">
          Learn more
        </Link>
      </span>
    </p>
  )
}
