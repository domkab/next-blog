import type { NextRequest, NextResponse } from 'next/server';

export function withLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const start = Date.now();
    const res = await handler(req);

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'anon';

    const method = req.method;
    const path = req.nextUrl.pathname;
    const duration = Date.now() - start;

    console.log(`[${new Date().toISOString()}] ${method} ${path} from ${ip} in ${duration}ms`);
    return res;
  };
}