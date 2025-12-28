
import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';
import { searchMetadata } from '@/lib/metadata/search';

export const metadata = searchMetadata

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}