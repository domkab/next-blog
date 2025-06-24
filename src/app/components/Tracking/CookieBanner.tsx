'use client';

import CookieConsent from 'react-cookie-consent';
import { loadGtag, enableAdsense } from '@/lib/analytics';

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      cookieName="cookie_consent"
      sameSite="lax"
      buttonText="Accept all"
      declineButtonText="Reject"
      enableDeclineButton
      style={{ background: '#1e293b' }}
      buttonClasses="bg-teal-600 px-4 py-2 rounded text-white"
      declineButtonClasses="bg-slate-500 px-4 py-2 rounded text-white"
      onAccept={() => {
        document.cookie = 'cookie_consent=accept; Max-Age=31536000; path=/; SameSite=Lax';
        document.cookie = 'needs_banner=1; Max-Age=0; path=/';  // delete
        loadGtag();
        enableAdsense();
      }}
      onDecline={() => {
        document.cookie = 'cookie_consent=reject; Max-Age=31536000; path=/; SameSite=Lax';
        document.cookie = 'needs_banner=1; Max-Age=0; path=/';  // delete
      }}
    >
      We use cookies and Google AdSense to personalise content and measure
      traffic.{' '}
      <a href="/privacy-policy" className="underline text-teal-400">
        Learn more
      </a>
      .
    </CookieConsent>
  );
}