import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { LegalSection, LegalTable, Mail } from "@/components/legal/LegalPage"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies and browser storage Wallpaperz uses for sign-in, preferences, analytics and Google AdSense ads, and how to manage your consent.",
  alternates: { canonical: "/cookies" },
  openGraph: { url: "https://www.wallpaperz.in/cookies", title: "Cookie Policy | Wallpaperz" },
}

const toc = [
  { id: "what", title: "What cookies are" },
  { id: "consent", title: "Your consent" },
  { id: "essential", title: "Essential cookies & storage" },
  { id: "analytics", title: "Analytics" },
  { id: "advertising", title: "Advertising (Google AdSense)" },
  { id: "manage", title: "Managing cookies" },
  { id: "contact", title: "Contact" },
]

const ext = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {label}
  </a>
)

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="Which cookies and browser storage we use, and how to control them."
      toc={toc}
    >
      <LegalSection id="what" title="1. What cookies are">
        <p>
          Cookies are small text files a website stores in your browser. Similar technologies include local storage
          and tracking pixels. We call them all &ldquo;cookies&rdquo; here. Some are set by us (first-party); others are
          set by services we use, such as Google (third-party). This policy is part of our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection id="consent" title="2. Your consent">
        <ul>
          <li>
            <strong>EU, EEA, UK and Switzerland:</strong> you&apos;ll see a consent message from Google, a
            Google-certified consent management platform. Advertising and analytics cookies are only used for the
            purposes you agree to. You can choose non-personalised ads, and you can change your choice at any time via
            the &ldquo;Privacy and cookie settings&rdquo; link shown on the page.
          </li>
          <li>
            <strong>US states with privacy laws</strong> (such as California): you may see a Google message with a
            &ldquo;Do not sell or share my personal information&rdquo; option. See{" "}
            <Link href="/privacy#us-privacy">US state privacy rights</Link>.
          </li>
          <li>
            <strong>Everywhere else:</strong> by using the site, you agree to the cookies described here. You can still
            block or delete them using the options in <a href="#manage">Managing cookies</a>.
          </li>
        </ul>
        <p>Essential cookies don&apos;t need consent because the site can&apos;t work properly without them.</p>
      </LegalSection>

      <LegalSection id="essential" title="3. Essential cookies & storage">
        <LegalTable
          head={["Name", "Set by", "Purpose", "Duration"]}
          rows={[
            [<code key="c">__session</code>, "Clerk", "Keeps you signed in", "Session / short-lived, refreshed"],
            [<code key="c">__client_uat</code>, "Clerk", "Tells the site whether you're signed in", "Up to 1 year"],
            [<code key="c">__clerk_*</code>, "Clerk", "Sign-in security and session handling", "Varies"],
            [<code key="c">__cf_bm</code>, "Cloudflare", "Bot and abuse protection", "30 minutes"],
            [
              <code key="c">wz_cc</code>,
              "Wallpaperz",
              "Your country (from your IP address), so we know whether to ask for consent before loading analytics",
              "1 day",
            ],
            [<code key="c">theme</code>, "Wallpaperz (local storage)", "Remembers light or dark mode", "Until you clear it"],
            [
              <code key="c">pwa-*</code>,
              "Wallpaperz (local storage)",
              "Remembers if you installed or dismissed the app prompt",
              "Until you clear it",
            ],
            [
              <code key="c">github_star_count</code>,
              "Wallpaperz (local storage)",
              "Caches the GitHub star count shown in the header",
              "Until you clear it",
            ],
          ]}
        />
        <p>
          The site can also be installed as an app, which stores files in your browser (a service worker cache) so it
          loads faster.
        </p>
      </LegalSection>

      <LegalSection id="analytics" title="4. Analytics">
        <LegalTable
          head={["Service", "Cookies", "Purpose", "Duration"]}
          rows={[
            [
              "Google Analytics 4",
              <code key="c">_ga, _ga_*</code>,
              "Counts visits and measures which pages are used",
              "Up to 2 years",
            ],
            [
              "Microsoft Clarity",
              <code key="c">_clck, _clsk, CLID, MUID</code>,
              "Heatmaps and session replays to find usability problems",
              "1 day to 1 year",
            ],
            ["Cloudflare Web Analytics", "None", "Privacy-friendly page view counts, no cookies", "No cookies"],
          ]}
        />
        <p>
          In the EU, EEA, UK and Switzerland, Microsoft Clarity loads only after you consent, and Google Analytics sets
          no cookies until you do.
        </p>
        <p>
          Opt out of Google Analytics with the{" "}
          {ext("https://tools.google.com/dlpage/gaoptout", "Google Analytics opt-out add-on")}. Learn how Microsoft
          uses data in the {ext("https://privacy.microsoft.com/privacystatement", "Microsoft Privacy Statement")}.
        </p>
      </LegalSection>

      <LegalSection id="advertising" title="5. Advertising (Google AdSense)">
        <p>
          Free use of Wallpaperz is paid for by ads served by Google AdSense. Google and its partners use cookies (for
          example <code>__gads</code>, <code>__gpi</code>, <code>__eoi</code>, and <code>IDE</code> on
          doubleclick.net) to serve ads, limit how often you see the same ad, detect fraud, measure results and, where
          you allow it, show personalised ads based on your visits to this and other websites. Some last up to 13
          months.
        </p>
        <p>
          Pro and Lifetime members don&apos;t load the AdSense script, so no advertising cookies are set by our site for
          them once signed in.
        </p>
        <ul>
          <li>
            {ext("https://policies.google.com/technologies/partner-sites", "How Google uses data from sites that use its services")}
          </li>
          <li>{ext("https://policies.google.com/technologies/ads", "How Google uses cookies in advertising")}</li>
          <li>{ext("https://adssettings.google.com", "Google Ad Settings")}: turn off personalised ads</li>
        </ul>
      </LegalSection>

      <LegalSection id="manage" title="6. Managing cookies">
        <ul>
          <li>
            Change your consent choice with the &ldquo;Privacy &amp; cookie settings&rdquo; link in our footer (it
            reopens Google&apos;s consent message where one is shown) or the privacy settings link from that message.
          </li>
          <li>
            Block or delete cookies in your browser settings. Blocking essential cookies will stop sign-in from
            working.
          </li>
          <li>
            Opt out of interest-based ads at {ext("https://adssettings.google.com", "adssettings.google.com")},{" "}
            {ext("https://optout.aboutads.info", "optout.aboutads.info")} (US) or{" "}
            {ext("https://www.youronlinechoices.eu", "youronlinechoices.eu")} (EU).
          </li>
          <li>Clear local storage by clearing your browser&apos;s site data for wallpaperz.in.</li>
        </ul>
      </LegalSection>

      <LegalSection id="contact" title="7. Contact">
        <p>
          Questions about cookies? Email <Mail />.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
