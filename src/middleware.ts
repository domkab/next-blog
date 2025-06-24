import { NextResponse, type NextRequest } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import { isRateLimited, logRequest } from './middleware_utils/mwutils';
import { getIpAndCountry } from './middleware_utils/geo';

// ---------- config ----------
const MAX_REQUESTS = Number(process.env.RATE_LIMIT) || 40;
const WINDOW_MS = 60_000;

// ---------- middleware ----------
const middlewareHandler = clerkMiddleware(async (_auth, req: NextRequest) => {
  const { ip, country, isEU } = await getIpAndCountry(req);
  logRequest(req, ip);
  console.log(ip, country, isEU);

  const res = NextResponse.next();

  /* 3: EU cookie-banner header */
  // if (isEU && !req.cookies.has('banner_shown')) {
  //   res.headers.set('x-requires-cookie-banner', '1');
  // };

  if (isEU && !req.cookies.has('cookie_consent')) {
    res.cookies.set('needs_banner', '1', {
      path: '/',
      maxAge: 60 * 5,
      httpOnly: false,
      sameSite: 'lax',
    });
  }

  /* 4: simple rate-limit for GET /api/* */
  const isApiGet =
    req.method === 'GET' && req.nextUrl.pathname.startsWith('/api');

  if (isApiGet && isRateLimited(ip ?? 'anon', MAX_REQUESTS, WINDOW_MS)) {
    console.warn(`[RATE LIMIT] ${ip} exceeded`);

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