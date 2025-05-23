'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/firebase/firebase';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (analytics) {
      console.log('Logging page_view:', pathname);
      logEvent(analytics, 'page_view', {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}