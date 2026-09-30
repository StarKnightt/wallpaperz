import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { LegalSection, Mail } from "@/components/legal/LegalPage"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules for using Wallpaperz: eligibility, accounts, the wallpaper license, the AI generator and its content policy, payments, refunds, and copyright complaints.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "https://www.wallpaperz.in/terms", title: "Terms of Service | Wallpaperz", images: [DEFAULT_OG_IMAGE] },
}

const toc = [
  { id: "about", title: "About these terms" },
  { id: "eligibility", title: "Who can use Wallpaperz" },
  { id: "accounts", title: "Your account" },
  { id: "wallpapers", title: "Site wallpapers" },
  { id: "ai-generator", title: "The AI generator" },
  { id: "acceptable-use", title: "Acceptable use & AI content policy" },
  { id: "enforcement", title: "How we enforce these rules" },
  { id: "ai-outputs", title: "Who owns AI-generated images" },
  { id: "payments", title: "Plans, payments & subscriptions" },
  { id: "refunds", title: "Refunds" },
  { id: "withdrawal", title: "EU/UK right of withdrawal" },
  { id: "packs", title: "Digital packs on Gumroad" },
  { id: "third-parties", title: "Ads & third-party services" },
  { id: "copyright", title: "Copyright complaints (DMCA)" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "liability", title: "Limitation of liability" },
  { id: "termination", title: "Suspension & termination" },
  { id: "changes", title: "Changes to the service and these terms" },
  { id: "law", title: "Governing law & disputes" },
  { id: "contact", title: "Contact" },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="The rules for downloading wallpapers, generating AI images and buying plans on Wallpaperz."
      toc={toc}
    >
      <LegalSection id="about" title="1. About these terms">
        <p>
          Wallpaperz (<Link href="/">wallpaperz.in</Link>) is a wallpaper website run by Prasenjit, an individual
          developer based in India. In these terms, &ldquo;Wallpaperz&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; and
          &ldquo;our&rdquo; mean Wallpaperz (operated by Prasenjit, India). &ldquo;You&rdquo; means anyone who visits
          the site or uses any part of it.
        </p>
        <p>
          By using Wallpaperz you agree to these Terms of Service, our <Link href="/privacy">Privacy Policy</Link>,{" "}
          <Link href="/cookies">Cookie Policy</Link>, <Link href="/refund-policy">Refund Policy</Link> and{" "}
          <Link href="/license">Wallpaper License</Link>. If you don&apos;t agree, please don&apos;t use the site.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Who can use Wallpaperz">
        <ul>
          <li>
            <strong>18 or older</strong> (or the age of majority where you live, if higher): you can use everything,
            including the AI generator and paid plans.
          </li>
          <li>
            <strong>13 to 17:</strong> you may browse and download wallpapers only with the permission of a parent or
            legal guardian. You may not use the AI generator or buy anything.
          </li>
          <li>
            <strong>Under 13:</strong> Wallpaperz is not for you, and you may not use it. We don&apos;t knowingly collect
            personal information from children under 13 (see the <Link href="/privacy#children">Privacy Policy</Link>).
          </li>
        </ul>
        <p>
          By creating an account, using the AI generator or making a purchase, you confirm that you meet these
          requirements and that you are legally able to enter into this agreement.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="3. Your account">
        <p>
          You don&apos;t need an account to browse or download wallpapers. You do need one to use the AI generator or
          buy a plan. Sign-in is handled by our authentication provider, Clerk.
        </p>
        <ul>
          <li>Give accurate information and keep your sign-in details secure.</li>
          <li>One person per account. Don&apos;t share, sell or transfer your account.</li>
          <li>Don&apos;t create multiple accounts to get extra free generations.</li>
          <li>You are responsible for what happens under your account. Tell us quickly if you think it was misused.</li>
        </ul>
        <p>
          You can delete your account at any time from your account settings or by emailing <Mail />. Deleting your
          account ends any remaining credits or plan access without a refund, except where the{" "}
          <Link href="/refund-policy">Refund Policy</Link> or the law says otherwise.
        </p>
      </LegalSection>

      <LegalSection id="wallpapers" title="4. Site wallpapers">
        <p>
          Wallpapers on the site are free to download, with no sign-up, for <strong>personal use</strong> on your own
          devices. You may not resell them, bundle them into wallpaper packs, apps or websites, or redistribute them as
          your own collection. Attribution is welcome: each wallpaper page has a ready-made credit snippet. The full
          rules are in the <Link href="/license">Wallpaper License</Link>.
        </p>
        <p>
          Many site wallpapers are AI-generated. Some come from third-party sources, and their original licenses and
          creators&apos; rights still apply. See <Link href="/ai-transparency">AI Transparency</Link>.
        </p>
      </LegalSection>

      <LegalSection id="ai-generator" title="5. The AI generator">
        <p>
          The generator at <Link href="/ai-generate">/ai-generate</Link> creates images from the text prompts you
          write. Your prompt is sent to our AI provider, Stability AI, and the generated image is returned to your
          browser. We don&apos;t keep a copy of your prompts or generated images on our servers, so save any image you
          want to keep.
        </p>
        <ul>
          <li>Free accounts get 5 generations per day. Paid plans are described in section 9.</li>
          <li>
            We may apply daily, monthly and site-wide limits to keep the service fair and affordable. A generation that
            fails on our side is not counted.
          </li>
          <li>
            Results are produced automatically. They can be unexpected, inaccurate or low quality, and they may look
            similar to images others generate.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="acceptable-use" title="6. Acceptable use & AI content policy">
        <p>When you use Wallpaperz, and especially the AI generator, you must not create, request or upload:</p>
        <ul>
          <li>Sexual, pornographic or otherwise NSFW content, including nudity.</li>
          <li>
            Anything that sexualises, exploits or endangers minors, or depicts minors in any harmful context. We report
            child sexual abuse material to the authorities.
          </li>
          <li>
            Images of real, identifiable people without their consent, including deepfakes, fake &ldquo;photos&rdquo;
            meant to deceive, and intimate or humiliating imagery.
          </li>
          <li>
            Hate speech or imagery, harassment, threats, glorification of violence, terrorism or self-harm.
          </li>
          <li>Content that is illegal, or promotes illegal activity, where you live or in India.</li>
          <li>
            Content that infringes someone else&apos;s rights: copyrighted characters or artwork, trademarks and logos,
            or a celebrity&apos;s name or likeness.
          </li>
          <li>Misinformation or content designed to mislead people about real events or people.</li>
        </ul>
        <p>You also must not:</p>
        <ul>
          <li>
            Try to bypass our prompt filters, safety settings, rate limits or payment checks (for example with
            jailbreak prompts, multiple accounts or automated requests).
          </li>
          <li>
            Scrape, crawl or bulk-download the site, use our wallpapers or outputs to build datasets or train AI
            models, or resell access to the generator.
          </li>
          <li>Interfere with the site&apos;s security or performance, or access it in ways we didn&apos;t intend.</li>
          <li>Break any law, or these terms, or help someone else do so.</li>
        </ul>
      </LegalSection>

      <LegalSection id="enforcement" title="7. How we enforce these rules">
        <p>To keep Wallpaperz safe, we may, at our discretion and where the law allows:</p>
        <ul>
          <li>Filter, block or refuse prompts, and our AI provider may also refuse or blur results.</li>
          <li>Remove content, limit features, or suspend or close accounts that break these terms.</li>
          <li>Cancel access without a refund when the account was closed for a serious or repeated breach.</li>
          <li>Report illegal content to the relevant authorities.</li>
        </ul>
        <p>
          If you think we made a mistake, email <Mail /> and we will review it.
        </p>
      </LegalSection>

      <LegalSection id="ai-outputs" title="8. Who owns AI-generated images">
        <p>
          As between you and Wallpaperz, we don&apos;t claim ownership of the images you generate. You may use them
          for personal and commercial purposes, to the extent the law allows and subject to{" "}
          <a href="https://stability.ai/terms-of-use" target="_blank" rel="noopener noreferrer">
            Stability AI&apos;s terms
          </a>{" "}
          and these terms.
        </p>
        <ul>
          <li>
            <strong>No guarantee of copyright.</strong> In many countries, purely AI-generated images may not be
            protected by copyright, so you may not be able to stop others from copying them.
          </li>
          <li>
            <strong>No guarantee of uniqueness.</strong> Other people may get very similar images from similar prompts.
          </li>
          <li>
            <strong>Your responsibility.</strong> You are responsible for how you use your images, including making sure
            they don&apos;t infringe anyone&apos;s rights (for example if your prompt named a brand, character or real
            person).
          </li>
        </ul>
        <p>
          You give us permission to process your prompts and images only as needed to run the generator. We don&apos;t
          publish your generated images on the site.
        </p>
      </LegalSection>

      <LegalSection id="payments" title="9. Plans, payments & subscriptions">
        <p>
          Browsing and downloading wallpapers is free. Paid plans only add AI generations and remove ads. Current
          prices are shown on the <Link href="/pricing">pricing page</Link>:
        </p>
        <ul>
          <li>
            <strong>Credit packs:</strong> 50 credits for $3 or 150 credits for $8. One credit = one AI generation.
            Credits never expire, but they have no cash value and can&apos;t be transferred, sold or exchanged.
          </li>
          <li>
            <strong>Pro:</strong> $5 per month or $40 per year. Includes 300 AI generations per month and no ads.
            Unused monthly generations don&apos;t roll over.
          </li>
          <li>
            <strong>Lifetime:</strong> $29 once. Pro features for the lifetime of the service, with a fair-use cap of
            300 AI generations per month. &ldquo;Lifetime&rdquo; means for as long as Wallpaperz operates the AI
            generator, not the lifetime of the buyer. If we ever shut it down, we will give at least 30 days&apos;
            notice.
          </li>
        </ul>
        <h3>Billing through Dodo Payments</h3>
        <p>
          Payments are processed by{" "}
          <a href="https://dodopayments.com" target="_blank" rel="noopener noreferrer">
            Dodo Payments
          </a>
          , which acts as our Merchant of Record. That means Dodo Payments is the seller on your invoice and handles
          billing, sales tax/VAT/GST, invoices and the processing of refunds. Its own terms also apply to your
          purchase. Prices are in US dollars; applicable taxes are calculated and shown at checkout, and your bank may
          add currency conversion fees.
        </p>
        <h3>Subscriptions</h3>
        <ul>
          <li>Pro renews automatically each month or year until you cancel.</li>
          <li>
            You can cancel anytime from the billing portal on the pricing page or by emailing us. Cancellation takes
            effect at the end of the current billing period, and you keep Pro until then.
          </li>
          <li>We don&apos;t give refunds for partial billing periods, except as set out in the Refund Policy.</li>
          <li>
            If we change the price of a subscription, we&apos;ll tell you in advance and the new price will apply from
            your next renewal. You can cancel before then.
          </li>
          <li>If a payment fails, your plan may be paused or ended until payment succeeds.</li>
        </ul>
      </LegalSection>

      <LegalSection id="refunds" title="10. Refunds">
        <p>In short (the full rules are in the <Link href="/refund-policy">Refund Policy</Link>):</p>
        <ul>
          <li>Unused credit packs can be refunded within 7 days of purchase on request.</li>
          <li>
            A first-time Pro or Lifetime purchase can be refunded within 7 days if you&apos;ve used fewer than 20 AI
            generations.
          </li>
          <li>Used credits and partial subscription periods are not refundable.</li>
          <li>
            Chargebacks or payment fraud may lead to the account being suspended. Please contact us first; we&apos;re
            happy to help.
          </li>
        </ul>
        <p>
          To ask for a refund, email <Mail /> from your account email.
        </p>
      </LegalSection>

      <LegalSection id="withdrawal" title="11. EU/UK right of withdrawal">
        <p>
          If you live in the European Union or the United Kingdom, you normally have a 14-day right to withdraw from an
          online purchase of digital content or services without giving a reason.
        </p>
        <p>
          Our credits and plans are supplied immediately. When you buy, you expressly ask us to start supplying the
          digital content right away, and you acknowledge that you <strong>lose your right of withdrawal</strong> once
          supply has begun, for example once you use your first credit or first Pro/Lifetime generation. Until then,
          you can withdraw within 14 days of purchase by emailing <Mail />; a clear statement that you want to withdraw
          is enough.
        </p>
        <p>
          This doesn&apos;t replace our voluntary refund promise: unused credit packs can still be refunded within 7
          days, and you keep any rights you have under the law if something you bought is faulty or not as described.
        </p>
      </LegalSection>

      <LegalSection id="packs" title="12. Digital packs on Gumroad">
        <p>
          Separate premium wallpaper packs are sold on our Gumroad store (
          <a href="https://prasenjitt.gumroad.com" target="_blank" rel="noopener noreferrer">
            prasenjitt.gumroad.com
          </a>
          ). Those purchases are made through Gumroad, under Gumroad&apos;s terms, and come with a personal-use license:
          you can use the wallpapers on your own devices, but you may not share, resell or redistribute the files.
          Questions about a Gumroad purchase can also be sent to <Mail />.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="13. Ads & third-party services">
        <p>
          Free use of Wallpaperz is supported by ads from Google AdSense. Pro and Lifetime members don&apos;t see
          ads. The site relies on third-party services (such as Clerk, Dodo Payments, Stability AI, Cloudflare and
          ImageKit) and may link to other websites. We aren&apos;t responsible for third-party sites, ads or services,
          and your use of them is subject to their own terms. See the <Link href="/privacy#processors">Privacy
          Policy</Link> for the full list.
        </p>
      </LegalSection>

      <LegalSection id="copyright" title="14. Copyright complaints (DMCA)">
        <p>
          We respect creators&apos; rights. If you believe a wallpaper or other content on Wallpaperz infringes your
          copyright or other rights, email <Mail /> with the subject &ldquo;Copyright complaint&rdquo; and include:
        </p>
        <ol>
          <li>Your name, postal address, phone number and email address.</li>
          <li>A description of the work you believe is being infringed (a link to the original is ideal).</li>
          <li>The exact URL(s) on wallpaperz.in of the material you want removed.</li>
          <li>
            A statement that you have a good-faith belief that the use is not authorised by the rights owner, its agent
            or the law.
          </li>
          <li>
            A statement that the information in your notice is accurate and, under penalty of perjury, that you are the
            rights owner or authorised to act on the owner&apos;s behalf.
          </li>
          <li>Your physical or electronic signature (typing your full name is fine).</li>
        </ol>
        <p>
          We&apos;ll review valid notices promptly and remove or disable access to the material where appropriate. If
          your content was removed and you believe it was a mistake, you can send a counter-notice with the same
          details, explaining why. We may share a notice with the person who uploaded the content. Accounts that
          repeatedly infringe will be closed. Knowingly false notices may make you liable for damages.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="15. Disclaimers">
        <p>
          We work hard to keep Wallpaperz running well, but the site, wallpapers and AI generator are provided
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the fullest extent the law allows, we don&apos;t promise
          that the service will be uninterrupted, error-free or secure, that AI results will meet your expectations,
          or that content will be available forever. Nothing in these terms limits rights you have as a consumer that
          cannot be excluded by law.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="16. Limitation of liability">
        <p>To the fullest extent the law allows:</p>
        <ul>
          <li>
            We aren&apos;t liable for indirect or consequential losses, such as lost profits, lost data or loss of
            goodwill.
          </li>
          <li>
            Our total liability to you for any claim related to Wallpaperz is limited to the greater of the amount you
            paid us in the 12 months before the claim or US$50.
          </li>
        </ul>
        <p>
          We don&apos;t exclude or limit liability that can&apos;t be limited by law, such as liability for death or
          personal injury caused by negligence, fraud, or your statutory consumer rights.
        </p>
        <p>
          If you misuse the service or break these terms, you are responsible for the resulting claims and costs,
          to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="17. Suspension & termination">
        <p>
          You can stop using Wallpaperz and delete your account at any time. We may suspend or close your account, or
          block access to the site, if you break these terms, if required by law, or to protect users or the service.
          Where reasonable, we&apos;ll tell you why and give you a chance to respond. Sections that by their nature
          should continue (such as ownership, disclaimers and liability) survive termination.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="18. Changes to the service and these terms">
        <p>
          We may change or discontinue features, plans or prices. We may also update these terms; the &ldquo;Last
          updated&rdquo; date above shows the latest version. If a change significantly affects you, for example to
          paid features, we&apos;ll give reasonable notice on the site or by email. Continuing to use Wallpaperz after a
          change takes effect means you accept the updated terms. If you don&apos;t, you can cancel and stop using the
          service.
        </p>
      </LegalSection>

      <LegalSection id="law" title="19. Governing law & disputes">
        <p>
          These terms are governed by the laws of India, and disputes will be handled by the courts of India. If you
          are a consumer living in the EU, the UK or another country with mandatory consumer protection laws, you
          keep the protection of those laws and may bring a claim in the courts of your country of residence.
        </p>
        <p>
          Before starting any formal dispute, please email <Mail /> so we can try to sort it out informally.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="20. Contact">
        <p>
          Questions about these terms? Email <Mail />. We usually reply within 2&ndash;3 business days. More ways to
          reach us are on the <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
