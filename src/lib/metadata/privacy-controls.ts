import { Metadata } from 'next';
import { SITE_NAME } from '../constants';
import { seoDefaults } from './seoDefaults';

export const privacyControlsMetadata: Metadata = {
  title: { absolute: `${SITE_NAME} | privacy controls` },
  ...seoDefaults,
  keywords: [
    "privacy controls",
    "data protection",
    "user privacy settings",
    "information security",
    "cookie management",
    "personal data control",
    "data collection preferences",
    "data usage options",
    "GDPR settings",
    "privacy management",
  ],
  description: "Manage your privacy settings and control how your data is used on Pixel Tech Blog.",
  alternates: { canonical: '/privacy-controls' },
};