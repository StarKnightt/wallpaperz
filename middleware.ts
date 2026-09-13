import { clerkMiddleware } from "@clerk/nextjs/server"; 
import { NextResponse, type NextRequest } from "next/server";

// Canonical host. The apex (wallpaperz.in) and plain http both served 200 after
// the Cloudflare Workers move (Vercel used to 308 apex -> www), so Google saw
// every page on four hosts and started indexing apex duplicates. Every
// rel=canonical, sitemap URL and OG url points at www, so collapse the
// alternates with a permanent redirect before anything else runs.
const CANONICAL_HOST = "www.wallpaperz.in";
const APEX_HOST = "wallpaperz.in";

function canonicalRedirect(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  if (host !== APEX_HOST && host !== CANONICAL_HOST) return null; // localhost, previews, workers.dev
  // Cloudflare exposes the scheme the visitor actually used via
  // x-forwarded-proto / cf-visitor; fall back to the request URL itself.
  const url = new URL(req.url);
  const proto =
    req.headers.get("x-forwarded-proto") ??
    (req.headers.get("cf-visitor")?.includes('"http"') ? "http" : null) ??
    url.protocol.replace(":", "");
  if (host === CANONICAL_HOST && proto !== "http") return null;
  url.protocol = "https:";
  url.host = CANONICAL_HOST;
  return NextResponse.redirect(url, 301);
}

export default clerkMiddleware((auth, req) => {
  const redirect = canonicalRedirect(req);
  if (redirect) return redirect;

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
  // Skip middleware for static files and favicon. The crawler-facing XML/TXT
  // files are matched explicitly so the apex->www redirect covers them too.
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/(sitemap.xml|wallpapers-sitemap.xml|robots.txt)",
  ],
};