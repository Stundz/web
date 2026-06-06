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
    "cookie",
    "referer",
    "authorization",
    "x-requested-with",
  ];
  let clonedHeaders = req.headers;

  // Use clean dictionary lookups to avoid leaking internal structures
  const rawHeaders =
    typeof serverReq.headers.toJSON === "function"
      ? serverReq.headers.toJSON()
      : serverReq.headers;

  for (const [key, value] of Object.entries(rawHeaders)) {
    if (safeHeaders.includes(key.toLowerCase()) && value) {
      clonedHeaders = clonedHeaders.set(key, value as string | string[]);
    }
  }

  return next(req.clone({ headers: clonedHeaders }));
};
