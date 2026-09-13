import type { Metadata } from 'next'

// Auth UI is client-rendered by Clerk and has no search value; keep it out of
// the index (robots.txt must NOT block it, or Google never sees this tag).
export const metadata: Metadata = {
  title: 'Sign up',
  robots: { index: false, follow: true },
  alternates: { canonical: '/sign-up' },
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children
}
