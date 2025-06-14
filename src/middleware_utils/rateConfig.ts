// src/middleware_utils/rateConfig.ts
export const RATE_LIMIT_PATH = '/api';
export const MAX_REQUESTS = Number(process.env.RATE_LIMIT);
export const WINDOW_MS = 60_000;
export const uploadLimits = new Map<string, { count: number; lastReset: number }>();