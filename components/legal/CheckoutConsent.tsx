import Link from "next/link"
import { cn } from "@/lib/utils"

export default function CheckoutConsent({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      By purchasing, you agree to the{" "}
      <Link href="/terms#payments" className="underline underline-offset-2 hover:text-foreground">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link href="/refund-policy" className="underline underline-offset-2 hover:text-foreground">
        Refund Policy
      </Link>
      . Payments are processed by Dodo Payments, our Merchant of Record. You request immediate access to your credits
      or plan and acknowledge that, in the EU/UK, you lose your 14-day right of withdrawal once you start using them
      (for example, your first generation). Unused credit packs can still be refunded within 7 days.
    </p>
  )
}
