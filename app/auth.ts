import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { User, Account, Profile } from "next-auth"

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
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email.split('@')[0],
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: { strategy: "jwt" as const },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async redirect() {
      return 'https://wallpaperz.in'
    },
    async signIn({ user, account, profile }: { 
      user: User, 
      account: Account | null, 
      profile?: Profile 
    }) {
      if (!user.email) return false
      return true
    },
    async session({ session, token }: { 
      session: Session, 
      token: JWT 
    }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.accessToken = token.accessToken
      }
      return session
    },
    async jwt({ token, account }: { 
      token: JWT, 
      account: Account | null 
    }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    }
  },
  events: {
    async createUser({ user }: { user: User }) {
      // You can add additional logic here when a user is created
      console.log('New user created:', user)
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
