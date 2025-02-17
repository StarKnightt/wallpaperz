import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"

// Add custom session type
declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      username?: string
      email?: string
      name?: string
      image?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
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
  session: { strategy: "jwt" as const },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async redirect() {
      return 'https://wallpaperz.in'
    },
    async session({ session, token }: { 
      session: Session, 
      token: JWT 
    }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, account }: { 
      token: JWT, 
      account: any | null 
    }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
