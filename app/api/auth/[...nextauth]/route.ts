import NextAuth from "next-auth"
import { authOptions } from "@/app/auth"

// Remove any runtime configuration
const handler = NextAuth(authOptions)

// Export the handler as both GET and POST
export { handler as GET, handler as POST }
