import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const termsConditionsMetadata: Metadata = {
  title: { absolute: `${SITE_NAME} | terms and conditions` },
  description: `Read the terms and conditions of ${SITE_NAME} to understand the rules and guidelines for using our website.`,
  keywords: [
    "terms and conditions",
    "user agreement",
    "website policies",
    "legal terms",
    "site usage",
    "liability",
    "intellectual property",
    "user responsibilities",
    "disclaimer",
    "governing law",
  ],
  alternates: { canonical: '/terms-and-conditions' },
};