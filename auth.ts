import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token }) {
      return token
    }
  }
})
