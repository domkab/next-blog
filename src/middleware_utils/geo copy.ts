import { NextRequest } from 'next/server';

type IPGeoData = {
  ip: string;
  success: boolean;
  country?: string;
  country_code?: string;
  is_eu?: boolean;
  city?: string;
  region?: string;
  timezone?: {
    id: string;
    abbr: string;
    is_dst: boolean;
    offset: number;
    utc: string;
    current_time: string;
  };
};

// function normalizeIp(ip: string): string {
//   return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
// }

const ipGeoCache = new Map<string, { data: IPGeoData; timestamp: number }>();
// const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_DURATION_MS = 1

export async function getGeoWithCache(ip: string): Promise<IPGeoData | null> {
  const cached = ipGeoCache.get(ip);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }

  try {
    const response = await fetch(`https://ipwho.is/${ip}`);
    if (!response.ok) return null;

    const data: IPGeoData = await response.json();
    if (!data.success) return null;

    ipGeoCache.set(ip, { data, timestamp: now });

    return data;
  } catch {
    console.warn('Geo lookup failed for', ip);

    return null;
  }
}

export async function getIpAndCountry(
  req: NextRequest
): Promise<{ ip: string; country: string; isEU: boolean }> {
  console.log('Running getIpAndCountry');

  const ip = (() => {
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';

    return rawIp.startsWith('::ffff:') ? rawIp.slice(7) : rawIp;
  })();

  if (process.env.NODE_ENV === 'development') {
    const mockGeo = req.nextUrl.searchParams.get('mockGeo');

    if (mockGeo) {
      console.log('[Geo] Mocking geo location:', mockGeo);

      return {
        ip,
        country: mockGeo.toUpperCase(),
        isEU: true,
      };
    }

    // local override for cookie banner
    const isLocal =
      ip === '::1'||
      ip.startsWith('127.') ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip === 'localhost';

    if (isLocal) {
      console.log('[Geo] Skipping geo lookup for private IP:', ip);

      // console.log(ip, country, isEU);

      return {
        ip,
        country: 'LT',
        isEU: true,
      };
    }
  }

  const geo = await getGeoWithCache(ip);
  console.log('[Geo] Fetched geo data:', geo);

  if (process.env.NODE_ENV === 'development') {
    console.log('[Geo] Lookup result:', {
      ip,
      country: geo?.country_code,
      isEU: geo?.is_eu,
    });
  }

  return {
    ip,
    country: geo?.country_code ?? 'UNKNOWN',
    isEU: geo?.is_eu ?? false,
  };
}