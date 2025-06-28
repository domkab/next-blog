import { NextRequest } from 'next/server';
import { uploadLimits } from './rateConfig';

// ========== Utilities ==========
export function logRequest(req: NextRequest, ip: string | null) {
  const { method, nextUrl } = req;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${nextUrl.pathname} from ${ip}`);
}

export function isRateLimited(
  ip: string | null,
  max: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const key = ip ?? 'anon';
  const entry = uploadLimits.get(key) ?? { count: 0, lastReset: now };

  if (now - entry.lastReset > windowMs) {
    entry.count = 1;
    entry.lastReset = now;
  } else {
    entry.count++;
  }
  uploadLimits.set(key, entry);

  return entry.count > max;
}
