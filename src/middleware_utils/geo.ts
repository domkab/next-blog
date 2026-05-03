// src/middleware_utils/geo.ts
import type { NextRequest } from "next/server";

interface IPGeoData {
  ip: string;
  success: boolean;
  country_code?: string;
  region_code?: string;
  is_eu?: boolean;
}

/* ── EU country codes ── */
const EU_CODES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "NO",
  "IS",
  "LI",
  "CH",
  "GB",
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
    console.warn("Geo lookup failed for", ip);

    return null;
  }
}

const getClientIp = (req: NextRequest) => {
  const raw =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  return raw.startsWith("::ffff:") ? raw.slice(7) : raw;
};

/* ──────────────────────────────────────────────────────────────── */
/*  MAIN helper                                                    */
/* ──────────────────────────────────────────────────────────────── */
export async function getIpAndCountry(req: NextRequest): Promise<{
  ip: string;
  country: string;
  region: string | undefined;
  isEU: boolean;
  isCalifornia: boolean;
}> {
  /* 1 — extract client IP */
  const ip = getClientIp(req);
  const mockCountry = req.nextUrl.searchParams.get("mockGeo");
  const mockRegion = req.nextUrl.searchParams.get("mockRegion"); // e.g. CA

  /* 2 — development overrides ---------------------------------- */
  if (process.env.NODE_ENV === "development" && mockCountry) {
    const country = mockCountry.toUpperCase();
    const region = mockRegion?.toUpperCase();

    return {
      ip,
      country,
      region,
      isEU: EU_CODES.has(country),
      isCalifornia: country === "US" && region === "CA",
    };
  }

  /* 3 — real lookup -------------------------------------------- */
  const country =
    req.headers.get("x-vercel-ip-country")?.toUpperCase() ?? "UNKNOWN";

  const region =
    req.headers.get("x-vercel-ip-country-region")?.toUpperCase() ?? undefined;

  return {
    ip,
    country,
    region,
    isEU: EU_CODES.has(country),
    isCalifornia: country === "US" && region === "CA",
  };
}
