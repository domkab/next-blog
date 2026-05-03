import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { isRateLimited, logRequest } from "./middleware_utils/mwutils";
import { getIpAndCountry } from "./middleware_utils/geo";

// ---------- config ----------
const MAX_REQUESTS = Number(process.env.RATE_LIMIT) || 40;
const WINDOW_MS = 60_000;

// ---------- middleware ----------
const middlewareHandler = clerkMiddleware(async (_auth, req: NextRequest) => {
  const { ip, isEU, isCalifornia } = await getIpAndCountry(req);
  logRequest(req, ip);

  const hasConsent = req.cookies.has("cookie_consent");
  const shouldShowCookieBanner = !hasConsent && (isEU || isCalifornia);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(
    "x-should-show-cookie-banner",
    shouldShowCookieBanner ? "1" : "0",
  );

  /* 4: simple rate-limit for GET /api/* */
  const isApiGet =
    req.method === "GET" && req.nextUrl.pathname.startsWith("/api");

  if (isApiGet && isRateLimited(ip ?? "anon", MAX_REQUESTS, WINDOW_MS)) {
    console.warn(`[RATE LIMIT] ${ip} exceeded`);

    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export default middlewareHandler;

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:[a-z0-9]+)$).*)", "/api/:path*"],
};
