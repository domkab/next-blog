import { Metadata } from 'next';
import { SITE_NAME } from '../constants';

export const layoutMetadata: Metadata = {
  title: `${SITE_NAME} | Home`,
  keywords: [
    "tech blog",
    "technology",
    "gadgets",
    "reviews",
    "news",
    "articles",
  ],
  description: "Tech blog with articles on technology, gadgets, and more.",
};