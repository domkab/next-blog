'use client';

import { useEffect, useState } from 'react';
import CookieBanner from './CookieBanner';

export default function CookieBannerToggle() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const needsBanner =
      document?.querySelector('meta[name="x-requires-cookie-banner"]') ||
      (window.__NEXT_DATA__?.props?.pageProps?.requiresBanner ?? false);

    if (needsBanner) setShow(true);
  }, []);

  if (!show) return null;

  return <CookieBanner />;
}