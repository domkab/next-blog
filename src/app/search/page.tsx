'use client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: `Browse posts | ${SITE_TITLE}`,
  description: `Explore tech news ${SITE_TITLE}`,
};

import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';
import { SITE_TITLE } from '@/lib/constants';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}