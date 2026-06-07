import { isPlatformServer } from "@angular/common";
import type { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID, REQUEST } from "@angular/core";

export const ssrInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformServer(platformId)) {
    return next(req);
  }

  const serverReq = inject(REQUEST, { optional: true }) as any;

  if (!serverReq || !serverReq.headers) {
    return next(req);
  }

  const safeHeaders = [
    "COOKIE",
    "REFERER",
    "AUTHORIZATION",
    "X-REQUESTED-WITH",
    "HOST",
    "USER-AGENT",
  ];

  // Explicitly typing this to accept any string key, accommodating our dynamic addition
  const clonedHeaders: Record<string, string | Array<string>> = {};

  // 1. Transfer the safe headers from the incoming platform request
  for (const key of safeHeaders) {
    clonedHeaders[key] = decodeURIComponent(serverReq.headers.get(key) || "");
  }

  // 2. Extract XSRF-TOKEN from the cookie string and set the token header
  const cookieHeader = (clonedHeaders["COOKIE"] as string) || "";
  const xsrfTokenMatch = cookieHeader.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

  if (xsrfTokenMatch) {
    const token = decodeURIComponent(xsrfTokenMatch[1]);
    clonedHeaders["X-XSRF-TOKEN"] = token;
  }
  clonedHeaders["HOST"] = "api.stundz.localhost";
  clonedHeaders["Accept"] = "application/json";

  console.log("Cloned headers, ", clonedHeaders);

  return next(req.clone({ setHeaders: clonedHeaders }));
};
