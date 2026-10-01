import { clerkMiddleware } from "@clerk/nextjs/server"; 
import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_COOKIE } from "@/lib/consent";

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

// Pages are prerendered, so the client can't see the visitor's country. Hand it
// Cloudflare's cf-ipcountry via a cookie; DomainGatedScripts uses it to hold
// Clarity until consent in CONSENT_REGIONS. Only set when missing or changed.
function withCountryHint(req: NextRequest, res: NextResponse) {
  const country = req.headers.get("cf-ipcountry")?.toUpperCase();
  if (!country || !/^[A-Z0-9]{2}$/.test(country)) return res;
  if (req.cookies.get(COUNTRY_COOKIE)?.value === country) return res;
  res.cookies.set(COUNTRY_COOKIE, country, { path: "/", maxAge: 86400, sameSite: "lax", secure: true });
  return res;
}

// Every wallpaper URL ends in a 24-hex ImageKit fileId. Anything else can never
// resolve, and letting /wallpaper/[id] SSR its notFound() blows the 10ms CPU cap
// (503). Rewriting to a path with no route serves the prebuilt static 404.
const WALLPAPER_SEGMENT = /^\/wallpaper\/([^/]+)\/?$/;
const WALLPAPER_ID = /[0-9a-f]{24}$/i;

// Nothing is protected here on purpose: every page is public (signed-out
// /ai-generate renders its landing view) and each authenticated API route
// checks `await auth()` itself so it can answer 401 JSON instead of a
// redirect. Webhooks authenticate by signature. clerkMiddleware only has to
// run so auth() works in those handlers.
export default clerkMiddleware((_auth, req) => {
  const redirect = canonicalRedirect(req);
  if (redirect) return redirect;
  const segment = req.nextUrl.pathname.match(WALLPAPER_SEGMENT)?.[1];
  if (segment && !WALLPAPER_ID.test(segment)) {
    return NextResponse.rewrite(new URL("/_not-found-wallpaper", req.url));
  }
  if (!req.nextUrl.pathname.startsWith("/api/")) return withCountryHint(req, NextResponse.next());
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