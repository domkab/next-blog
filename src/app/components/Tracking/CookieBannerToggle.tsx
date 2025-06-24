'use client';

import { useEffect, useState } from 'react';
import CookieBanner from './CookieBanner';

export default function CookieBannerToggle() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (document.cookie.includes('needs_banner=1')) {
      setShow(true);
    };

    console.log('needs banner');
  }, []);

  if (!show) return null;
  return <CookieBanner />;
}