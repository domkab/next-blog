'use client';

import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/firebase/firebase';
import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkTrackerProps {
  href: string;
  eventName: string;
  eventData?: Record<string, unknown>;
  children: ReactNode;
  className?: string;
}

export default function LinkTracker({
  href,
  eventName,
  eventData,
  children,
  className,
}: LinkTrackerProps) {
  const handleClick = () => {
    if (analytics) {
      logEvent(analytics, eventName, eventData || {});
    }
  };

  useEffect(() => {
    console.log(`[GA] LinkTracker ready for event: "${eventName}"`, eventData);
    if (!analytics) {
      console.warn('[GA] analytics not available yet.');
    }
  }, [eventName, eventData]);

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}