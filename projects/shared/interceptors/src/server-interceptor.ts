import { isPlatformServer } from "@angular/common";
import type { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID, REQUEST } from "@angular/core";
import { ENVIRONMENT } from "shared/types";

/** Headers copied from the incoming browser request to API calls made during SSR. */
const FORWARDED_HEADERS = [
  "cookie",
  "referer",
  "authorization",
  "x-requested-with",
  "user-agent",
];

/**
 * SERVER ONLY. Makes API calls rendered on the server behave as if the user's
 * browser had sent them. It never runs any logic in the browser.
 *
 * It owns everything server-specific:
 *  - forwarding the user's cookies/credentials to our own API (and only ours)
 *  - exposing the XSRF cookie value as the X-XSRF-TOKEN header
 *  - defaulting Accept to JSON
 *
 */
export const serverInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isPlatformServer(inject(PLATFORM_ID))) {
    return next(req);
  }

  const environment = inject(ENVIRONMENT);

  // Never leak the user's credentials to third-party URLs
  if (!new RegExp(`^https?://api.${environment.domain}`).test(req.url)) {
    return next(req);
  }

  const serverReq = inject(REQUEST, { optional: true });
  if (!serverReq?.headers) {
    return next(req);
  }

  const headers: Record<string, string> = {};

  for (const name of FORWARDED_HEADERS) {
    const value = serverReq.headers.get(name);
    if (value) headers[name] = value; // forwarded untouched, only when present
  }

  // The XSRF cookie value (URL-encoded) becomes the header the API expects
  if (!req.headers.has("X-XSRF-TOKEN")) {
    const match = headers["cookie"]?.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    if (match) {
      try {
        headers["X-XSRF-TOKEN"] = decodeURIComponent(match[1]);
      } catch {
        headers["X-XSRF-TOKEN"] = match[1];
      }
    }
  }

  if (!req.headers.has("Accept")) {
    headers["Accept"] = "application/json";
  }

  return next(req.clone({ setHeaders: headers }));
};
