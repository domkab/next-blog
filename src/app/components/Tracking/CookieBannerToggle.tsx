'use client';

import { useEffect, useState } from 'react';
import CookieBanner from './CookieBanner';

export default function CookieBannerToggle() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cookies = document.cookie;

    const needsBanner = cookies.includes('needs_banner=1');
    const hasConsent = cookies.includes('cookie_consent=full') || cookies.includes('cookie_consent=necessary');

    if (needsBanner && !hasConsent) {
      setShow(true);
    }
  }, []);

  return show ? <CookieBanner /> : null;
}