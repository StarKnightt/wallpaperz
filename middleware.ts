import { NextResponse } from "next/server"
import { auth } from "./app/auth"

export default auth((req) => {
  // Only protect routes that start with /protected
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/protected')
  const isAuth = !!req.auth

  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL('/auth/signin', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // Only run middleware on routes that match this pattern
  matcher: ["/protected/:path*"]
}
