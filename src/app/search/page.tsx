
import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';
import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: `Search | ${SITE_NAME}`,
  description: `Search articles, posts, and more on ${SITE_NAME}.`,
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}