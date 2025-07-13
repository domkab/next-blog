'use client';

import { useEffect } from 'react';
import { loadGtag } from '@/lib/analytics';

export default function AnalyticsLoader() {
  useEffect(() => {
    loadGtag(); // always run on client to load analytics with denied consent
  }, []);

  return null;
}