import { clerkMiddleware } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const publicRoutes = [
    "/",
    "/category/(.*)",
    "/about",
    "/privacy",
    "/api/wallpapers(.*)",
    "/api/healthcheck",
    // Add more public routes as needed
  ];
  
  const ignoredRoutes = [
    "/api/webhook",
    // Add more ignored routes as needed
  ];

  // Check if the route is in the ignored list
  if (ignoredRoutes.some(route => new RegExp(`^${route}$`).test(req.nextUrl.pathname))) {
    return NextResponse.next();
  }

  // Allow public routes without authentication
  if (publicRoutes.some(route => new RegExp(`^${route}$`).test(req.nextUrl.pathname))) {
    return NextResponse.next();
  }
  
  // For protected routes, auth information is already available in the request
  return NextResponse.next();
});
 
export const config = {
  // Skip middleware for static files and favicon
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};