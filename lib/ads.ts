// Publisher ID is public by nature (it's served in /ads.txt); the protection
// against clones is the hostname gate in useAdGate, not secrecy of the ID.
export const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9812963383908086"

// Responsive display ad units (AdSense > Ads > By ad unit). An empty ID renders
// nothing, leaving that spot to Auto ads.
export const AD_SLOTS = {
  /** Inside listing grids, after the first rows; on wallpaper pages below the details */
  inContent: process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT || "",
  /** Bottom of listing grids and below the related wallpapers */
  bottom: process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM || "",
}
