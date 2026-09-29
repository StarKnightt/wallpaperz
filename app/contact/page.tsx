import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Clock, CreditCard, ShieldAlert, Lock } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import LegalPage, { CONTACT_EMAIL } from "@/components/legal/LegalPage"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions, billing and refunds, wallpaper takedowns, privacy requests or partnership ideas: email Wallpaperz at contact@wallpaperz.in.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "https://www.wallpaperz.in/contact", title: "Contact Wallpaperz" },
}

const topics = [
  {
    icon: CreditCard,
    title: "Billing & refunds",
    text: "Include the email you used at checkout and your Dodo Payments order number.",
    href: "/refund-policy",
    link: "Refund Policy",
  },
  {
    icon: ShieldAlert,
    title: "Copyright & takedowns",
    text: "Include the wallpaper URL and proof that you own the work.",
    href: "/terms#copyright",
    link: "Copyright process",
  },
  {
    icon: Lock,
    title: "Privacy & account deletion",
    text: "Write from your account email so we can verify the request.",
    href: "/privacy#rights",
    link: "Your privacy rights",
  },
]

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact Us"
      showLastUpdated={false}
      intro="Wallpaperz is run by one developer, Prasenjit. The fastest way to reach me is email."
    >
      <section className="rounded-2xl bg-primary/5 p-6 text-center md:p-10">
        <Mail className="mx-auto mb-4 h-10 w-10 text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-bold">Email</h2>
        <p className="mt-2 text-lg">
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden="true" />
          Typical response time: within 2&ndash;3 business days
        </p>
        <div className="mt-6">
          <a href={`mailto:${CONTACT_EMAIL}`} className={buttonVariants({ size: "lg" })}>
            Send an email
          </a>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {topics.map((t) => (
          <div key={t.title} className="rounded-2xl border p-5">
            <t.icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
            <Link href={t.href} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
              {t.link} &rarr;
            </Link>
          </div>
        ))}
      </div>
    </LegalPage>
  )
}
