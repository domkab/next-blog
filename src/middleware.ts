import { NextResponse, type NextRequest } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import { isRateLimited, logRequest } from './middleware_utils/mwutils';
import { getIpAndCountry } from './middleware_utils/geo';

// ---------- config ----------
const MAX_REQUESTS = Number(process.env.RATE_LIMIT) || 40;
const WINDOW_MS = 60_000;

// ---------- middleware ----------
const middlewareHandler = clerkMiddleware(async (_auth, req: NextRequest) => {
  const { ip, isEU } = await getIpAndCountry(req);
  logRequest(req, ip);

  const res = NextResponse.next();

  // EU cookie banner logic using isEU
  if (!req.cookies.has('banner_shown') && isEU) {
    res.headers.set('x-requires-cookie-banner', '1');
  };

  // Rate limiting
  const isTarget =
    req.method === 'GET' && req.nextUrl.pathname.startsWith('/api');

  if (isTarget && isRateLimited(ip, MAX_REQUESTS, WINDOW_MS)) {
    console.warn(`[RATE LIMIT] ${ip} exceeded limit`);
    return new NextResponse('Rate limit exceeded', { status: 429 });
  };

  return res;
});

export default middlewareHandler;

// Matcher config: all HTML pages and API routes, skip static files
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:[a-z0-9]+)$).*)',
    '/api/:path*',
  ],
};