import type { ComponentProps } from "react"
import type { ClerkProvider } from "@clerk/nextjs"

type Appearance = NonNullable<ComponentProps<typeof ClerkProvider>["appearance"]>

const token = (name: string) => `hsl(var(--${name}))`
// Clerk outlines fields and secondary buttons with colorBorder mixed down to
// 7-11% opacity, which vanishes with the site tokens; draw a solid line instead.
const line = { boxShadow: `0 0 0 1px ${token("input")}` }

// Clerk renders its modals and menus in this document and resolves these
// tokens when a component mounts, so each modal or menu picks up the current
// .dark/.light theme without re-rendering ClerkProvider.
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: token("primary"),
    colorPrimaryForeground: token("primary-foreground"),
    colorBackground: token("popover"),
    colorForeground: token("popover-foreground"),
    colorNeutral: token("foreground"),
    colorMuted: token("muted"),
    colorMutedForeground: token("muted-foreground"),
    colorInput: token("background"),
    colorInputForeground: token("foreground"),
    colorBorder: token("input"),
    colorRing: token("ring"),
    borderRadius: "var(--radius)",
    fontFamily: "inherit",
  },
  elements: {
    cardBox: { border: `1px solid ${token("border")}` },
    userButtonPopoverCard: { border: `1px solid ${token("border")}` },
    formFieldInput: { '&[data-variant="default"]': line },
    otpCodeFieldInput: { '&[data-variant="default"]': line },
    button: { cursor: "pointer" },
    formButtonPrimary: { cursor: "pointer" },
    socialButtonsBlockButton: { cursor: "pointer", '&[data-variant="outline"]': line },
    socialButtonsIconButton: { cursor: "pointer", '&[data-variant="outline"]': line },
    // Clerk ships a black GitHub mark.
    socialButtonsProviderIcon__github: { ".dark &": { filter: "invert(1)" } },
    footerActionLink: { cursor: "pointer" },
    userButtonTrigger: { cursor: "pointer" },
    userButtonPopoverActionButton: { cursor: "pointer" },
    modalCloseButton: { cursor: "pointer" },
  },
}
