import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

// ========== Config ==========
const RATE_LIMIT_PATH = '/api/image/image-url';
const MAX_REQUESTS = 40;
const WINDOW_MS = 60 * 1000; // 1 minute

const uploadLimits = new Map<string, { count: number; lastReset: number }>();

// ========== Utilities ==========
function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'anon'
  );
}

function logRequest(req: NextRequest, ip: string) {
  const { method, nextUrl } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${nextUrl.pathname} from ${ip}`);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = uploadLimits.get(ip) || { count: 0, lastReset: now };

  if (now - entry.lastReset > WINDOW_MS) {
    entry.count = 1;
    entry.lastReset = now;
  } else {
    entry.count++;
  }

  uploadLimits.set(ip, entry);
  return entry.count > MAX_REQUESTS;
}

// ========== Middleware ==========
const middlewareHandler = clerkMiddleware(async (auth, req: NextRequest) => {
  const ip = getIP(req);
  logRequest(req, ip);

  // Apply rate limiting only to this path
  const isRateLimitTarget =
    req.nextUrl.pathname.startsWith(RATE_LIMIT_PATH) &&
    req.method === 'GET';

  if (isRateLimitTarget && isRateLimited(ip)) {
    console.warn(`[RATE LIMIT] ${ip} exceeded limit for ${req.nextUrl.pathname}`);
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  return NextResponse.next();
});

export default middlewareHandler;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/api/image/image-url',
  ],
};