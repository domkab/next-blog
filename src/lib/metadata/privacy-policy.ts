import { Metadata } from 'next';
import { SITE_NAME } from '../constants';
import { seoDefaults } from './seoDefaults';

export const privacyPolicyMetadata: Metadata = {
  title: { absolute: `${SITE_NAME} | privacy policy` },
  ...seoDefaults,
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "information security",
    "cookie policy",
    "personal data",
    "data collection",
    "data usage",
    "GDPR compliance",
    "privacy practices",
  ],
  description: "Read the privacy policy of Pixel Tech Blog to understand how we handle your data and protect your privacy.",
  alternates: { canonical: '/privacy-policy' },
};