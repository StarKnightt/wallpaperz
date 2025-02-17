import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// Add custom session type
declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
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
          access_type: "offline",
          response_type: "code",
          redirect_uri: 'https://wallpaperz.in/api/auth/callback/google',
          scope: "openid email profile"
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
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    },
    async jwt({ token, account }: { token: JWT, account: any }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
