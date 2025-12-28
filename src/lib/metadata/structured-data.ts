import { email, SITE_NAME, SITE_URL } from '@/lib/constants'

export const ORG_ID = `${SITE_URL}/#org`;
export const SITE_ID = `${SITE_URL}/#website`;

export function buildOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/logo.svg`,
    // sameAs: [
    //   'https://www.linkedin.com/company/your-company',
    //   'https://www.instagram.com/your-handle',
    //   'https://vimeo.com/your-handle',
    // ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: email,
        areaServed: ["Worldwide"],
        availableLanguage: ['en'],
        url: `${SITE_URL}/contact`,
      },
    ],
  };
}

export function buildWebsite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
  };
}

export function buildBreadcrumb(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

export function buildCollectionPage({
  name,
  url,
  description,
  breadcrumb,
}: {
  name: string;
  url: string;
  description?: string;
  breadcrumb?: unknown;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['CollectionPage', 'WebPage'],
    '@id': `${url}#collection`,
    url,
    name,
    ...(description ? { description } : {}),
    ...(breadcrumb ? { breadcrumb } : {}),
    isPartOf: { '@id': SITE_ID },
  };
}