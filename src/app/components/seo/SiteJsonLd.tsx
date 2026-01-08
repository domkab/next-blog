
import { buildOrganization, buildWebsite } from '@/lib/metadata/structured-data';
import JsonLd from './JsonLd';

export default function SiteJsonLd() {
  return (
    <>
      <JsonLd id="ld-org" data={buildOrganization()} />
      <JsonLd id="ld-website" data={buildWebsite()} />
    </>
  )
}