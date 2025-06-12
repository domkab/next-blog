/* --------------------------------------------------------------------------
   Analytics helper – GA4 + Google AdSense with Consent Mode v2 (TS-safe)
   -------------------------------------------------------------------------- */

/* Minimal function signature that accepts every gtag command we use */
type GtagFn = (...args: [string, ...unknown[]]) => void;

// ---------------------------------------------------------- env vars -----
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';
const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';

// ------------------------------------------------------ consent flags ----
const GRANTED_FLAGS = {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
} as const;

// ----------------------------------------------------------- utilities ---
export const userHasConsented = () =>
  typeof document !== 'undefined' &&
  document.cookie.includes('cookie_consent=accept');

// --------------------------------------------------- dataLayer helper ----
function pushDL(...args: Parameters<GtagFn>) {
  window.dataLayer.push(args);
}

// --------------------------------------------------------- load gtag -----
export function loadGtag() {
  if (typeof window === 'undefined' || !GA_ID) return;

  if (!window.gtag) {
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    s.async = true;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = ((...a: Parameters<GtagFn>) => pushDL(...a)) as unknown as typeof window.gtag;

    window.gtag('js', new Date().toISOString());
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  window.gtag('consent', 'update', GRANTED_FLAGS);
  window.gtag('config', GA_ID, { page_path: window.location.pathname });
}

// ---------------------------------------------------- enable AdSense -----
export function enableAdsense() {
  if (typeof window === 'undefined' || !AD_CLIENT) return;
  if (document.querySelector('script[data-adsbygoogle]')) return;

  const ad = document.createElement('script');
  ad.async = true;
  ad.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;
  ad.setAttribute('data-adsbygoogle', 'true');
  ad.crossOrigin = 'anonymous';
  document.head.appendChild(ad);
}

export default { loadGtag, enableAdsense, userHasConsented };