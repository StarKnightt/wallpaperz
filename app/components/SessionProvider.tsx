import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"

export async function getSession() {
  const session = await getServerSession(authOptions)
  return session
} 