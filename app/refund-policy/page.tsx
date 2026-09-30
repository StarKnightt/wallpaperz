import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { LegalSection, Mail } from "@/components/legal/LegalPage"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "When Wallpaperz credit packs, Pro subscriptions and Lifetime plans can be refunded, how to cancel, and your EU/UK right of withdrawal.",
  alternates: { canonical: "/refund-policy" },
  openGraph: { url: "https://www.wallpaperz.in/refund-policy", title: "Refund Policy | Wallpaperz", images: [DEFAULT_OG_IMAGE] },
}

const toc = [
  { id: "summary", title: "Summary" },
  { id: "credit-packs", title: "Credit packs" },
  { id: "subscriptions", title: "Pro & Lifetime" },
  { id: "not-refundable", title: "What isn't refundable" },
  { id: "withdrawal", title: "EU/UK right of withdrawal" },
  { id: "how", title: "How to request a refund" },
  { id: "chargebacks", title: "Chargebacks" },
]

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="Simple rules for getting your money back on AI credits and plans."
      toc={toc}
    >
      <LegalSection id="summary" title="Summary">
        <ul>
          <li>Unused credit packs: refundable within 7 days of purchase.</li>
          <li>First-time Pro or Lifetime purchase: refundable within 7 days if you&apos;ve used fewer than 20 AI generations.</li>
          <li>Used credits and partial subscription periods: not refundable.</li>
          <li>Cancel Pro anytime; it stays active until the end of the period you paid for.</li>
        </ul>
        <p>
          Payments are handled by Dodo Payments, our Merchant of Record, which processes approved refunds back to your
          original payment method. Wallpaper downloads are free, so there&apos;s nothing to refund there. Purchases
          made on our Gumroad store follow Gumroad&apos;s refund process, but you can still email us about them.
        </p>
      </LegalSection>

      <LegalSection id="credit-packs" title="Credit packs">
        <p>
          If you haven&apos;t used any credits from a pack, you can ask for a full refund within 7 days of buying it. If
          you&apos;ve used some, we may refund the unused part at our discretion; used credits are not refundable.
          Credits never expire, so there&apos;s no rush to use them.
        </p>
      </LegalSection>

      <LegalSection id="subscriptions" title="Pro & Lifetime">
        <ul>
          <li>
            If this is your <strong>first</strong> Pro subscription or Lifetime purchase and you&apos;ve made fewer than
            20 AI generations with it, you can ask for a full refund within 7 days of the purchase.
          </li>
          <li>
            Renewals are not refundable, so cancel before your renewal date if you don&apos;t want to continue. You can
            cancel from the billing portal on the <Link href="/pricing">pricing page</Link> or by emailing us.
          </li>
          <li>
            When you cancel, you keep Pro until the end of the current billing period. We don&apos;t refund partial
            months or years.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="not-refundable" title="What isn't refundable">
        <ul>
          <li>Credits or generations you&apos;ve already used.</li>
          <li>Requests made after the 7-day window, unless the law requires otherwise.</li>
          <li>Subscription renewals and partial billing periods.</li>
          <li>Accounts closed for breaking the <Link href="/terms#acceptable-use">acceptable use rules</Link>.</li>
        </ul>
        <p>
          None of this limits your legal rights if something you bought is faulty, not as described, or not delivered.
          If the generator was unavailable for a long time because of a problem on our side, get in touch and
          we&apos;ll make it right.
        </p>
      </LegalSection>

      <LegalSection id="withdrawal" title="EU/UK right of withdrawal">
        <p>
          Consumers in the EU and UK normally have 14 days to withdraw from an online purchase. Because credits and
          plans are digital content supplied immediately, at checkout you ask for immediate access and acknowledge
          that you lose this right once supply begins, for example when you use your first credit or generation.
        </p>
        <p>
          If you haven&apos;t used anything yet, you can still withdraw within 14 days by emailing <Mail />. Our
          voluntary 7-day refund for unused credit packs applies in addition to this.
        </p>
      </LegalSection>

      <LegalSection id="how" title="How to request a refund">
        <p>Email <Mail /> from the email address on your Wallpaperz account and include:</p>
        <ul>
          <li>The email used at checkout.</li>
          <li>The order or invoice number from your Dodo Payments receipt, if you have it.</li>
          <li>What you bought and, optionally, why you&apos;d like a refund.</li>
        </ul>
        <p>
          We usually reply within 2&ndash;3 business days. Once a refund is approved, any remaining credits or plan
          access from that purchase are removed. Depending on your bank, the money can take 5&ndash;10 business days
          to appear.
        </p>
      </LegalSection>

      <LegalSection id="chargebacks" title="Chargebacks">
        <p>
          Please contact us before disputing a charge with your bank; it&apos;s almost always faster. Chargebacks,
          payment fraud or abuse of this policy (for example repeated buy-and-refund) may lead to the account being
          suspended and any credits or plan access being removed.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
