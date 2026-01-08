import { Metadata } from 'next';
import { SITE_NAME } from '../constants';
import { seoDefaults } from './seoDefaults';

export const searchMetadata: Metadata = {
  title: { absolute: `${SITE_NAME} | articles` },
  ...seoDefaults,
  keywords: [
    "tech blog",
    "technology",
    "gadgets",
    "reviews",
    "news",
    "articles",
    "browse posts",
    "latest updates",
    "tech trends",
    "how-to guides",
    "product reviews",
    "industry insights",
  ],
  description: "Tech blog with articles on technology, gadgets, and more. Browse posts, reviews, and insights on the latest tech trends.",
  alternates: { canonical: '/search' },
};