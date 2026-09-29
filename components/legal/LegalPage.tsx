import Link from "next/link"
import type { ReactNode } from "react"

export const LEGAL_LAST_UPDATED = "September 29, 2026"
export const CONTACT_EMAIL = "contact@wallpaperz.in"

export const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/license", label: "Wallpaper License" },
  { href: "/ai-transparency", label: "AI Transparency" },
  { href: "/terms#copyright", label: "Copyright / DMCA" },
] as const

export interface TocItem {
  id: string
  title: string
}

// Styles plain HTML children; the project has no typography plugin.
const PROSE =
  "space-y-4 leading-7 text-foreground/90 " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80 " +
  "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 " +
  "[&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground " +
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] " +
  "[&_h3]:pt-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground"

export function Mail({ children }: { children?: ReactNode }) {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{children ?? CONTACT_EMAIL}</a>
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl bg-primary/5 p-6 md:p-8">
      <h2 className="mb-4 text-xl font-bold md:text-2xl">{title}</h2>
      <div className={PROSE}>{children}</div>
    </section>
  )
}

export function LegalTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row, i) => (
            <tr key={i} className="align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface LegalPageProps {
  title: string
  intro?: ReactNode
  toc?: TocItem[]
  showLastUpdated?: boolean
  children: ReactNode
}

export default function LegalPage({ title, intro, toc, showLastUpdated = true, children }: LegalPageProps) {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-6xl">
            {title}
          </h1>
          {showLastUpdated && (
            <p className="text-center text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>
          )}
          {intro && (
            <div className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground">{intro}</div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 pb-16">
        {toc && toc.length > 0 && (
          <nav aria-label="On this page" className="mb-8 rounded-2xl border p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">On this page</h2>
            <ol className="grid list-decimal gap-x-8 gap-y-1.5 pl-5 text-sm sm:grid-cols-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-foreground/80 hover:text-primary">
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="space-y-6">{children}</div>

        <nav aria-label="Legal pages" className="mt-12 border-t pt-6 text-sm text-muted-foreground">
          <p className="mb-2">Related pages</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
