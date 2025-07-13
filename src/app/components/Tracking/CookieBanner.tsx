'use client';

import { useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { loadGtag, enableAdsense } from '@/lib/analytics';

export default function CookieBanner() {
  useEffect(() => {
    loadGtag();
  }, []);

  return (
    <CookieConsent
      location="bottom"
      cookieName="cookie_consent"
      sameSite="lax"
      buttonText="Accept all cookies"
      declineButtonText="Reject non-essential"
      enableDeclineButton
      style={{ background: '#1e293b' }}
      buttonClasses="bg-teal-600 px-4 py-2 rounded text-white"
      declineButtonClasses="bg-slate-500 px-4 py-2 rounded text-white"
      onAccept={() => {
        // Store consent flag
        document.cookie =
          'cookie_consent=full; Max-Age=31536000; path=/; SameSite=Lax';
        document.cookie =
          'needs_banner=1; Max-Age=0; path=/';

        // Update GA consent mode to granted
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
          });
        }

        enableAdsense();
      }}
      onDecline={() => {
        // Store necessary-only flag
        document.cookie =
          'cookie_consent=necessary; Max-Age=31536000; path=/; SameSite=Lax';
        document.cookie =
          'needs_banner=1; Max-Age=0; path=/';
      }}
    >
      We use cookies for analytics and personalised ads.{' '}
      <a href="/privacy-policy" className="underline text-teal-400">
        Learn&nbsp;more
      </a>
      .
    </CookieConsent>
  );
}