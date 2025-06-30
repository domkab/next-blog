'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Loads gtag.js immediately but starts with Consent Mode = denied.
 * If a previous “accept” cookie exists, we switch to granted on first paint.
 * Otherwise, CookieBanner will call window.gtag('consent','update', …) later.
 */
export default function GA() {
  if (process.env.NODE_ENV !== 'production' || !GA_ID) return null;

  return (
    <>
      {/* 1. gtag script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* 2. Init with Consent Mode v2 */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          /* ---- Consent Mode defaults (all denied) ---- */
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });

          /* ---- If user had already accepted on a prior visit ---- */
          if (document.cookie.includes('cookie_consent=full')) {
            gtag('consent', 'update', {
              ad_storage: 'granted',
              analytics_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted'
            });
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          }
        `}
      </Script>
    </>
  );
}