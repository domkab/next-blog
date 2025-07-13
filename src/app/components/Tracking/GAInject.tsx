'use client';

import Script from 'next/script';

export default function GAInject() {
  const GA_ID = 'G-Q66V3M4QDN';

  if (!GA_ID || process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      {/* Load GA script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* Init GA with Consent Mode */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname
          });
        `}
      </Script>
    </>
  );
}