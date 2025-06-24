import { headers } from 'next/headers';

export default async function MiddlewareHeader() {
  const hdrs = await headers();
  const needs = hdrs.get('x-requires-cookie-banner');
  if (!needs) return null;

  return <meta name="x-requires-cookie-banner" content="1" />;
}