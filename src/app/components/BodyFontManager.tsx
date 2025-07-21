'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function BodyFontManager() {
  const pathname = usePathname();

  useEffect(() => {
    const isDashboard = pathname.startsWith('/dashboard');
    const body = document.body;

    if (isDashboard) {
      body.classList.add('dashboard');
      body.classList.remove('front');
    } else {
      body.classList.add('front');
      body.classList.remove('dashboard');
    }
  }, [pathname]);

  return null;
}