// types/gtag-consent.d.ts
import 'gtag.js';

declare global {
  /** gtag() base overloads + consent mode (added earlier) */
  interface Gtag {
    (
      command: 'consent',
      consentType: 'default' | 'update',
      params: {
        ad_storage?: 'granted' | 'denied';
        analytics_storage?: 'granted' | 'denied';
        ad_user_data?: 'granted' | 'denied';
        ad_personalization?: 'granted' | 'denied';
      }
    ): void;
  }

  /** Tell TS the window always has a dataLayer array */
  interface Window {
    dataLayer: unknown[];
    gtag: Gtag;
  }
}

export {};