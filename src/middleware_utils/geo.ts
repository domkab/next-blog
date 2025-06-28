// src/middleware_utils/geo.ts
import type { NextRequest } from 'next/server';

interface IPGeoData {
  ip: string;
  success: boolean;
  country_code?: string;
  region_code?: string;
  is_eu?: boolean;
};

/* ── EU country codes ── */
const EU_CODES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'NO', 'IS', 'LI', 'CH', 'GB',
]);

/* ── Simple in-memory cache around ipwho.is ── */
const cache = new Map<string, { data: IPGeoData; ts: number }>();
const TTL = 6 * 60 * 60 * 1000; // 6 h

async function lookup(ip: string): Promise<IPGeoData | null> {
  const hit = cache.get(ip);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  try {
    const r = await fetch(`https://ipwho.is/${ip}`);

    if (!r.ok) return null;

    const data: IPGeoData = await r.json();

    if (!data.success) return null;

    cache.set(ip, { data, ts: Date.now() });

    return data;
  } catch {
    console.warn('Geo lookup failed for', ip);

    return null;
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  MAIN helper                                                    */
/* ──────────────────────────────────────────────────────────────── */
export async function getIpAndCountry(
  req: NextRequest,
): Promise<{
  ip: string;
  country: string;
  region: string | undefined;
  isEU: boolean;
  isCalifornia: boolean;
}> {
  /* 1 — extract client IP */
  const raw =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    // @ts-expect-error – present in dev runtime
    req.ip ??
    '::1';

  const ip = raw.startsWith('::ffff:') ? raw.slice(7) : raw;

  /* 2 — development overrides ---------------------------------- */
  if (process.env.NODE_ENV === 'development') {
    const mockCountry = req.nextUrl.searchParams.get('mockGeo');
    const mockRegion = req.nextUrl.searchParams.get('mockRegion'); // e.g. CA

    if (mockCountry) {
      const code = mockCountry.toUpperCase();
      const region = mockRegion?.toUpperCase();

      return {
        ip,
        country: code,
        region,
        isEU: EU_CODES.has(code),
        isCalifornia: code === 'US' && region === 'CA',
      };
    };

    const isLocal =
      ip === '::1' ||
      ip.startsWith('127.') ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.');

    if (isLocal) {
      return {
        ip,
        country: 'LT',
        region: undefined,
        isEU: true,
        isCalifornia: false,
      };
    };
  };

  /* 3 — real lookup -------------------------------------------- */
  const geo = await lookup(ip);

  const country = geo?.country_code ?? 'UNKNOWN';
  const region = geo?.region_code;
  const isEU = geo?.is_eu ?? EU_CODES.has(country);
  const isCalifornia = country === 'US' && region === 'CA';

  return { ip, country, region, isEU, isCalifornia };
}