'use client';

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
    if (process.env.NODE_ENV === 'production' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventData || {});
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}