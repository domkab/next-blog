import { Metadata } from 'next';
import { SITE_NAME } from '../constants';
import { seoDefaults } from './seoDefaults';

export const layoutMetadata: Metadata = {
  title: {
    default: `${SITE_NAME} | home`,
    template: `%s | ${SITE_NAME} | home`,
  },
  ...seoDefaults,
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