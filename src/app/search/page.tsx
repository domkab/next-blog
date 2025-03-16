'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}