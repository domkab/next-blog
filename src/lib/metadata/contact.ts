import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const contactMetadata: Metadata = {
  title: { absolute: `${SITE_NAME} | contact` },
  description: `Get in touch with the team at ${SITE_NAME}. We'd love to hear from you!`,
  keywords: [
    "contact",
    "get in touch",
    "support",
    "customer service",
    "inquiries",
    "feedback",
    "help",
    "questions",
    "reach out",
    "communication",
  ],
  alternates: { canonical: '/contact' },
};