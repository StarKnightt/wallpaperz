import type { Metadata } from 'next'

// Auth UI is client-rendered by Clerk and has no search value; keep it out of
// the index (robots.txt must NOT block it, or Google never sees this tag).
export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: true },
  alternates: { canonical: '/sign-in' },
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children
}
