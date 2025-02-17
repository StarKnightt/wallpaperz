import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" as const },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Always use the deployment URL for callbacks
      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
