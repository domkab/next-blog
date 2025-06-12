import CookieConsent from 'react-cookie-consent';
import { loadGtag, enableAdsense } from '@/lib/analytics';

<CookieConsent
  location="bottom"
  buttonText="Accept all"
  declineButtonText="Reject"
  enableDeclineButton
  cookieName="cookie_consent"
  sameSite="lax"
  style={{ background: '#1e293b' }}          // or Tailwind classes via className
  buttonClasses="bg-teal-600 px-4 py-2 rounded text-white"
  declineButtonClasses="bg-slate-500 px-4 py-2 rounded text-white"
  onAccept={() => {
    loadGtag();        // loads gtag.js and/or calls gtag('consent', 'update', ...)
    enableAdsense();   // only if you load AdSense dynamically
  }}
>
  We use cookies and Google AdSense to personalise content and measure traffic.{' '}
  <a href="/privacy-policy" className="underline text-teal-400">Learn more</a>.
</CookieConsent>