import NextAuth, { Session } from "next-auth"
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
    error: '/auth/error', // Add this
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Always redirect to homepage after sign in
      return baseUrl
    },
    async session({ session, token }: { session: Session; token: any }) {
      return session
    }
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
