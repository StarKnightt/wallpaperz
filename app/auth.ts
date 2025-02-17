import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          redirect_uri: 'https://wallpaperz.in/api/auth/callback/github'
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          redirect_uri: 'https://wallpaperz.in/api/auth/callback/google'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Temporarily enable debug to see what's happening
  session: { strategy: "jwt" as const },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async redirect() {
      return 'https://wallpaperz.in'
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
