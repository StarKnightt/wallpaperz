// Regions where analytics/ad storage needs opt-in consent: EU 27 + EEA + UK + CH.
// Shared by the Consent Mode defaults (layout), the edge country hint
// (middleware) and the Clarity gate (DomainGatedScripts).
export const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "IS", "LI", "NO", "GB", "CH",
]

/** Visitor country from Cloudflare's cf-ipcountry, set by middleware for client-side gating. */
export const COUNTRY_COOKIE = "wz_cc"

// Google Consent Mode v2 defaults. Must run before any Google tag (GA4, AdSense).
// Google's certified CMP (AdSense Privacy & messaging) sends the consent update.
// A Global Privacy Control signal turns off ad personalisation everywhere else.
export const CONSENT_DEFAULTS_SCRIPT = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
var gpc=navigator.globalPrivacyControl===true;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(CONSENT_REGIONS)},wait_for_update:500});
gtag('consent','default',{ad_storage:'granted',ad_user_data:gpc?'denied':'granted',ad_personalization:gpc?'denied':'granted',analytics_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);
if(gpc){gtag('set','restricted_data_processing',true);(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}
`.trim()
