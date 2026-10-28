// Fails a Cloudflare deploy whose build picked up Clerk development keys (pk_test_).
// A dev instance in production 307s every cookieless browser to a handshake
// that the live secret can't verify, so first visits end in a 500.
// That happens when a build runs without .env.production.local (e.g. a fresh
// git worktree). Set ALLOW_CLERK_DEV_KEYS=1 to deploy a dev instance on purpose.
import { readFileSync } from "node:fs"

const file = ".open-next/cloudflare/next-env.mjs"
const src = readFileSync(file, "utf8")
const match = src.match(/export const production = (\{.*?\});?\n/s)
const key = match ? JSON.parse(match[1]).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "" : ""

if (!key.startsWith("pk_live_") && process.env.ALLOW_CLERK_DEV_KEYS !== "1") {
  console.error(`check-clerk-keys: production build has a ${key ? key.slice(0, 8) + "..." : "missing"} Clerk publishable key, expected pk_live_.`)
  console.error("Copy .env.production.local into this checkout and rebuild.")
  process.exit(1)
}
console.log("check-clerk-keys: production Clerk key is pk_live_")
