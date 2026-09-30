import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { LegalSection, LegalTable, Mail } from "@/components/legal/LegalPage"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What personal data Wallpaperz collects, why, who processes it, how long it's kept, and how to use your privacy rights under GDPR, UK GDPR, CCPA/CPRA and India's DPDP Act.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "https://www.wallpaperz.in/privacy", title: "Privacy Policy | Wallpaperz", images: [DEFAULT_OG_IMAGE] },
}

const toc = [
  { id: "who", title: "Who we are" },
  { id: "summary", title: "The short version" },
  { id: "collect", title: "Data we collect" },
  { id: "purposes", title: "Why we use it (legal bases)" },
  { id: "processors", title: "Service providers" },
  { id: "transfers", title: "International transfers" },
  { id: "retention", title: "How long we keep data" },
  { id: "rights", title: "Your rights" },
  { id: "us-privacy", title: "US state privacy rights (CCPA/CPRA)" },
  { id: "india", title: "India (DPDP Act 2023)" },
  { id: "children", title: "Children" },
  { id: "security", title: "Security" },
  { id: "delete", title: "Deleting your account" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact & grievances" },
]

const ext = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {label}
  </a>
)

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect, why, who helps us run the site, and the choices you have."
      toc={toc}
    >
      <LegalSection id="who" title="1. Who we are">
        <p>
          Wallpaperz (<Link href="/">wallpaperz.in</Link>) is run by Prasenjit, an individual developer in India, who
          is the data controller (&ldquo;data fiduciary&rdquo; under Indian law) for the personal data described here.
          You can reach us at <Mail />.
        </p>
      </LegalSection>

      <LegalSection id="summary" title="2. The short version">
        <ul>
          <li>You can browse and download wallpapers without an account.</li>
          <li>If you sign in, we get your email and basic profile from our sign-in provider, Clerk.</li>
          <li>
            AI prompts are sent to Stability AI to create your image. We don&apos;t store your prompts or images on our
            servers; we only log that a generation happened, so we can enforce limits.
          </li>
          <li>Payments are handled by Dodo Payments. We never see or store your card number.</li>
          <li>
            Free visitors see Google ads, and we use analytics to understand how the site is used. In the EU, EEA, UK
            and Switzerland we ask for your consent first.
          </li>
          <li>We don&apos;t sell your personal data for money.</li>
        </ul>
      </LegalSection>

      <LegalSection id="collect" title="3. Data we collect">
        <h3>Account data (if you sign in)</h3>
        <p>
          Your email address, name and profile picture (if provided by the sign-in method you choose, such as Google),
          a unique user ID, and sign-in and session information. This is collected and stored by Clerk on our behalf.
        </p>
        <h3>AI generator data</h3>
        <p>
          Your prompt and optional negative prompt are sent from our server to Stability AI, which generates the image
          and returns it to your browser. We don&apos;t save prompts or generated images; they disappear when you
          close or refresh the page, unless you download them. Stability AI processes prompts under its own terms and
          privacy policy.
        </p>
        <h3>Usage and plan records</h3>
        <p>
          In our database (Cloudflare D1) we store, for each generation, your user ID, the time and which allowance it
          used (free, Pro or credit). We also store your credit balance, plan and subscription status, renewal date,
          and payment references from Dodo Payments (customer ID, payment ID, product, amount and any refunds).
        </p>
        <h3>Payment data</h3>
        <p>
          When you buy, Dodo Payments (our Merchant of Record) collects your name, email, billing address and payment
          details. We receive order information but <strong>never your full card number</strong>.
        </p>
        <h3>Device, log and security data</h3>
        <p>
          Our host, Cloudflare, processes your IP address, browser and device type, pages requested and timestamps to
          deliver the site and protect it against attacks and abuse. Our image CDN, ImageKit, processes similar request
          data when it serves wallpapers.
        </p>
        <h3>Analytics</h3>
        <p>
          We use Google Analytics 4, Microsoft Clarity and Cloudflare Web Analytics to understand which pages are
          popular and where the site breaks. This includes pages viewed, approximate location (country/city), device
          and browser, referrer and interactions. Microsoft Clarity also records how you use the page (clicks,
          scrolling and mouse movement) as session replays and heatmaps; it masks text you type. Cloudflare Web
          Analytics doesn&apos;t use cookies.
        </p>
        <p>
          In the EU, EEA, UK and Switzerland, Microsoft Clarity only loads after you consent. Google Analytics and
          AdSense use Google Consent Mode: until you consent they set no analytics or advertising cookies and send only
          limited, cookieless signals.
        </p>
        <h3>Advertising</h3>
        <p>
          Free visitors see ads from Google AdSense. Google and its partners may use cookies and similar identifiers to
          show ads, limit how often you see them, measure performance and, where allowed, personalise ads based on your
          visits to this and other sites. See the <Link href="/cookies">Cookie Policy</Link>. Pro and Lifetime members
          don&apos;t load the ad script.
        </p>
        <h3>Things stored in your browser</h3>
        <p>
          Your light/dark theme choice, whether you dismissed the &ldquo;install app&rdquo; prompt, and a small cache
          are saved in your browser&apos;s local storage. They stay on your device.
        </p>
        <h3>When you contact us</h3>
        <p>If you email us, we get your email address and whatever you include in your message.</p>
        <p>
          We don&apos;t ask for sensitive data (such as health, religion or government IDs), and we ask you not to
          include it in prompts or emails.
        </p>
      </LegalSection>

      <LegalSection id="purposes" title="4. Why we use it (legal bases)">
        <p>
          For visitors in the EU, EEA and UK, we rely on the following legal bases under the GDPR and UK GDPR.
        </p>
        <LegalTable
          head={["Purpose", "Data", "Legal basis"]}
          rows={[
            ["Accounts and sign-in", "Account data", "Contract"],
            ["Generating AI images, enforcing limits, credits and plans", "Prompts, usage and plan records", "Contract"],
            ["Taking payments, invoices, taxes and refunds", "Payment data, plan records", "Contract; legal obligation"],
            ["Keeping the site secure and preventing abuse or fraud", "Log and usage data", "Legitimate interests"],
            ["Answering your emails", "Contact data", "Legitimate interests; contract"],
            ["Analytics (GA4, Clarity)", "Analytics data, cookies", "Consent (EU/EEA/UK/CH); legitimate interests elsewhere"],
            ["Cookieless analytics (Cloudflare)", "Aggregated usage data", "Legitimate interests"],
            ["Showing ads, including personalised ads", "Advertising cookies and identifiers", "Consent (EU/EEA/UK/CH)"],
          ]}
        />
        <p>
          Where we rely on legitimate interests, it is to run a reliable, safe and affordable free service, and you
          can object (see <a href="#rights">Your rights</a>). Where we rely on consent, you can withdraw it at any time.
        </p>
      </LegalSection>

      <LegalSection id="processors" title="5. Service providers">
        <p>
          We share personal data only with providers that help us run Wallpaperz, only for the purposes above, or when
          the law requires it. Each has its own privacy policy:
        </p>
        <LegalTable
          head={["Provider", "What it does", "Privacy policy"]}
          rows={[
            ["Clerk", "Sign-in and account management", ext("https://clerk.com/legal/privacy", "clerk.com")],
            [
              "Dodo Payments",
              "Merchant of Record: checkout, billing, taxes, invoices, refunds",
              ext("https://dodopayments.com/privacy-policy", "dodopayments.com"),
            ],
            ["Stability AI", "Generates AI images from your prompts", ext("https://stability.ai/privacy-policy", "stability.ai")],
            [
              "Cloudflare",
              "Hosting (Workers), storage (R2), database (D1), security, cookieless analytics",
              ext("https://www.cloudflare.com/privacypolicy/", "cloudflare.com"),
            ],
            ["ImageKit", "Image storage and delivery (CDN)", ext("https://imagekit.io/privacy-policy/", "imagekit.io")],
            [
              "Google (AdSense, Analytics)",
              "Advertising and analytics",
              ext("https://policies.google.com/technologies/partner-sites", "policies.google.com"),
            ],
            ["Microsoft Clarity", "Analytics, heatmaps and session replay", ext("https://privacy.microsoft.com/privacystatement", "privacy.microsoft.com")],
            ["Gumroad", "Sells our separate premium wallpaper packs", ext("https://gumroad.com/privacy", "gumroad.com")],
          ]}
        />
        <p>
          We may also disclose data if required by law, to protect our rights or users&apos; safety, or as part of a
          transfer of the site to a new owner (who would have to respect this policy).
        </p>
      </LegalSection>

      <LegalSection id="transfers" title="6. International transfers">
        <p>
          Wallpaperz is run from India, and our providers process data in several countries, including the United
          States. When personal data from the EU, EEA, UK or Switzerland is transferred to a country without an
          adequacy decision, we rely on safeguards such as the European Commission&apos;s Standard Contractual Clauses
          (and the UK Addendum) or the EU-U.S. Data Privacy Framework, as offered by each provider.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="7. How long we keep data">
        <ul>
          <li>
            <strong>Account data:</strong> until you delete your account. Clerk removes it when the account is deleted.
          </li>
          <li>
            <strong>Prompts and generated images:</strong> not stored by us. Stability AI may keep them for a limited
            time under its own policy.
          </li>
          <li>
            <strong>Generation logs</strong> (user ID, time, allowance type): 90 days, then deleted automatically.
          </li>
          <li>
            <strong>Credit balances and plan status:</strong> while your account exists, or until you ask us to erase
            them.
          </li>
          <li>
            <strong>Payment and invoice records:</strong> as long as tax and accounting laws require (typically up to 8
            years), held by us and by Dodo Payments.
          </li>
          <li>
            <strong>Emails:</strong> as long as needed to handle your request, then up to 2 years for reference.
          </li>
          <li>
            <strong>Analytics and advertising data:</strong> as set by Google, Microsoft and Cloudflare (for Google
            Analytics, we use a retention period of 14 months or less).
          </li>
          <li>
            <strong>Security logs:</strong> short periods set by Cloudflare, usually days to weeks.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="rights" title="8. Your rights">
        <p>Depending on where you live, you can ask us to:</p>
        <ul>
          <li><strong>Access</strong> the personal data we hold about you and get a copy.</li>
          <li><strong>Correct</strong> inaccurate data.</li>
          <li><strong>Delete</strong> your data (&ldquo;right to be forgotten&rdquo;).</li>
          <li><strong>Port</strong> your data to another service in a common format.</li>
          <li><strong>Object</strong> to processing based on legitimate interests.</li>
          <li><strong>Restrict</strong> processing while a concern is being resolved.</li>
          <li><strong>Withdraw consent</strong> for analytics or ads at any time, without affecting earlier processing.</li>
        </ul>
        <p>
          To use these rights, email <Mail /> from your account email. We may need to confirm your identity. We&apos;ll
          respond within one month (30 days), or tell you if we need more time as allowed by law. It&apos;s free.
        </p>
        <p>
          You also have the right to complain to your local data protection authority, for example your EU
          country&apos;s supervisory authority or, in the UK, the{" "}
          {ext("https://ico.org.uk/make-a-complaint/", "Information Commissioner's Office")}. We&apos;d appreciate the
          chance to help first.
        </p>
      </LegalSection>

      <LegalSection id="us-privacy" title="9. US state privacy rights (CCPA/CPRA)">
        <p>
          If you live in California or another US state with a privacy law, you have the right to know what personal
          information we collect, to access, correct and delete it, and to not be discriminated against for using these
          rights.
        </p>
        <ul>
          <li>
            <strong>Categories we collect:</strong> identifiers (email, user ID, IP address), commercial information
            (purchases and plan), internet activity (pages viewed, interactions), approximate geolocation, and
            inferences used for advertising. We don&apos;t collect sensitive personal information for inferring
            characteristics about you.
          </li>
          <li>
            <strong>Sources:</strong> you, your browser, and the providers listed above.
          </li>
          <li>
            <strong>Selling and sharing:</strong> we don&apos;t sell personal information for money. However, letting
            Google show personalised ads using cookies may count as &ldquo;sharing&rdquo; for cross-context behavioural
            advertising (or a &ldquo;sale&rdquo; under some state laws). We don&apos;t knowingly sell or share data of
            anyone under 16.
          </li>
        </ul>
        <h3 id="your-choices" className="scroll-mt-24">How to opt out of sale/sharing</h3>
        <ul>
          <li>
            Use the <strong>&ldquo;Do not sell or share my personal information&rdquo;</strong> option in the privacy
            message shown by Google on our site, where available in your state.
          </li>
          <li>
            Turn off personalised ads in {ext("https://adssettings.google.com", "Google Ad Settings")} and via{" "}
            {ext("https://optout.aboutads.info", "the DAA opt-out tool")}.
          </li>
          <li>
            Use a browser that sends a Global Privacy Control (GPC) signal. We treat it as an opt-out and tell Google
            not to personalise ads or use your data for ad personalisation. Blocking third-party cookies also helps.
          </li>
          <li>Upgrade to Pro or Lifetime, which doesn&apos;t load ads at all.</li>
          <li>
            Or email <Mail /> with &ldquo;Do not sell or share&rdquo; and we&apos;ll help. You can use an authorised
            agent to make a request on your behalf.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="india" title="10. India (DPDP Act 2023)">
        <p>
          If you are in India, you have the right under the Digital Personal Data Protection Act, 2023 to get a
          summary of the personal data we process and who we share it with, to correct, complete, update or erase it,
          to withdraw consent, to nominate someone to exercise your rights in case of death or incapacity, and to
          have your grievances addressed.
        </p>
        <p>
          Our grievance contact is Prasenjit, at <Mail />. We aim to respond to grievances within 30 days. If
          you&apos;re not satisfied, you may approach the Data Protection Board of India.
        </p>
      </LegalSection>

      <LegalSection id="children" title="11. Children">
        <p>
          Wallpaperz is not directed to children under 13, and we don&apos;t knowingly collect personal information from
          them. Users aged 13 to 17 may only browse and download wallpapers with a parent&apos;s or guardian&apos;s
          permission; accounts, the AI generator and purchases are for adults (see the{" "}
          <Link href="/terms#eligibility">Terms</Link>). If you believe a child has given us personal data, email{" "}
          <Mail /> and we&apos;ll delete it.
        </p>
      </LegalSection>

      <LegalSection id="security" title="12. Security">
        <p>
          We use HTTPS everywhere, rely on established providers for sign-in and payments so we never handle passwords
          or card numbers, keep the data we store to a minimum, and restrict access to our systems. No service is
          perfectly secure, but if a breach affects your data, we&apos;ll notify you and the authorities as the law
          requires.
        </p>
      </LegalSection>

      <LegalSection id="delete" title="13. Deleting your account">
        <p>
          Sign in, open your profile menu, choose <strong>Manage account</strong> and delete your account from the
          security settings. Or email <Mail /> from your account email and we&apos;ll delete it for you.
        </p>
        <p>
          Deleting your account removes your Clerk profile (email, name and sign-in data) and ends any remaining
          credits or plan access. Cancel an active subscription first so you aren&apos;t charged again. Records in our
          database are keyed to your user ID rather than your email: generation logs are deleted after 90 days, and
          we&apos;ll erase your credit and plan records on request. We keep payment records only as long as tax law
          requires.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="14. Changes to this policy">
        <p>
          We&apos;ll update this page when our practices change and revise the &ldquo;Last updated&rdquo; date. If a
          change is significant, we&apos;ll give notice on the site or by email.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="15. Contact & grievances">
        <p>
          For any privacy question or request, email <Mail />. We usually reply within 2&ndash;3 business days.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
