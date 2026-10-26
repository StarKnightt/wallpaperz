import { SITE_NAME, SITE_URL } from '@/lib/seo'
import { CATEGORY_SLUGS, categoryDescription, categoryNameFromSlug } from '@/lib/category-pages'
import { DEVICES } from '@/lib/devices'
import { FREE_PER_DAY, PLANS, PRO_PER_MONTH } from '@/lib/pricing'

// Built once at deploy time from static data, so requests cost no render CPU.
export const dynamic = 'force-static'

const MAX_DEVICES = 30

const link = (title: string, path: string, note: string) => `- [${title}](${SITE_URL}${path}): ${note}`
const firstSentence = (text: string) => text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text

function body(): string {
  const devices = [...DEVICES.filter((d) => d.featured), ...DEVICES.filter((d) => !d.featured)].slice(0, MAX_DEVICES)

  return [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} is a free library of HD and 4K wallpapers for desktop, laptop, phone and tablet, with downloads cropped to exact device resolutions. ` +
      `It also has an AI wallpaper generator: ${FREE_PER_DAY} free generations a day with an account, credit packs from $${PLANS.credits_50.priceUsd}, ` +
      `Pro at $${PLANS.pro_monthly.priceUsd}/month (${PRO_PER_MONTH} generations a month, no ads) or a one-time $${PLANS.lifetime.priceUsd} Lifetime plan.`,
    '',
    '## Core pages',
    '',
    link('Home', '/', 'Browse and search the full wallpaper library, newest first.'),
    link('AI wallpaper generator', '/ai-generate', 'Describe a wallpaper and generate a custom HD or 4K image with AI.'),
    link('Pricing', '/pricing', 'Free, credit pack, Pro and Lifetime plans for the AI generator.'),
    link('Laptop wallpapers', '/laptop-wallpapers', 'Landscape 4K and QHD wallpapers for laptops and PCs.'),
    link('Devices', '/devices', 'Exact screen resolutions for popular phones, tablets, laptops and monitors, with wallpapers cropped to fit.'),
    link('Wallpaper packs', '/packs', 'Curated packs with every design pre-cropped for phones, tablets and desktops.'),
    link('Blog', '/blog', 'Guides on wallpaper resolutions, live wallpapers, multi-monitor setups and AI prompts.'),
    '',
    '## Categories',
    '',
    ...CATEGORY_SLUGS.map((slug) =>
      link(`${categoryNameFromSlug(slug)} wallpapers`, `/category/${slug}`, firstSentence(categoryDescription(slug)))
    ),
    '',
    '## Devices',
    '',
    ...devices.map((d) => link(`${d.name} wallpapers`, `/devices/${d.slug}`, `Wallpapers cropped to ${d.width}x${d.height} (${d.display}).`)),
    '',
    '## Machine-readable',
    '',
    link('Sitemap', '/sitemap.xml', 'Every list, category, color, device and blog page.'),
    link('Wallpapers sitemap', '/wallpapers-sitemap.xml', 'Every individual wallpaper page with its image.'),
    link('robots.txt', '/robots.txt', 'Crawler rules.'),
    '',
    '## Optional',
    '',
    link('About', '/about', `About the ${SITE_NAME} project and how to support or contribute to it.`),
    link('Contact', '/contact', 'Contact for billing, copyright takedowns and privacy requests.'),
    link('License', '/license', 'What you can and cannot do with downloaded wallpapers.'),
    link('AI transparency', '/ai-transparency', 'Which wallpapers are AI-generated and how the generator works.'),
    link('Privacy policy', '/privacy', 'What data is collected and how it is used.'),
    link('Terms of service', '/terms', 'Terms for using the site and paid plans.'),
    link('Cookie policy', '/cookies', 'Cookies and similar technologies used on the site.'),
    link('Refund policy', '/refund-policy', 'Refund rules for credit packs, Pro and Lifetime.'),
    '',
  ].join('\n')
}

export function GET() {
  return new Response(body(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
