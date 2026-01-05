import { Metadata } from 'next';
import { SITE_NAME } from '../constants';
import { seoDefaults } from './seoDefaults';

export const notFoundMetadata: Metadata = {
  title: { absolute: `${SITE_NAME} | page not found` },
  ...seoDefaults,
  keywords: [
    "404 error",
    "page not found",
    "missing page",
    "broken link",
    "error message",
    "site navigation",
    "help",
    "support",
    "website issues",
    "user experience",
  ],
  description: "The page you are looking for cannot be found. Navigate back to the homepage or explore other sections of the site.",
  alternates: { canonical: '/not-found' },
};