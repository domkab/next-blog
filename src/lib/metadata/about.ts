import type { Metadata } from 'next';
import { SITE_NAME } from '../constants';
import { seoDefaults } from './seoDefaults';

export const aboutMetadata: Metadata = {
  ...seoDefaults,
  title: { absolute: `${SITE_NAME} | about` },
  description: `All about ${SITE_NAME} — a blog built for real people trying to make sense of modern tech.`,
  alternates: { canonical: '/about' },
};