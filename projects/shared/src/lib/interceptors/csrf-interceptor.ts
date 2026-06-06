import { isPlatformServer } from "@angular/common";
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  type HttpInterceptorFn,
  HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { catchError, switchMap, tap, throwError } from "rxjs";
import { ENVIRONMENT } from "../types";

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const environment = inject(ENVIRONMENT);
  const tokenExtractor = inject(HttpXsrfTokenExtractor);
  const platformId = inject(PLATFORM_ID);
  const http = new HttpClient(inject(HttpBackend)); // Bypass interceptor loop for CSRF fetching

  // Rule 1: Do nothing if the request URL is not targeting the API
  const isApiRequest = /^https?:\/\/api\.stundz\./i.test(req.url);
  if (!isApiRequest) {
    return next(req);
  }

  const isServer = isPlatformServer(platformId);
  const skipCsrfCheck = ["/user", "/login", "/signup"].some((path) =>
    req.url.endsWith(path),
  );

  // Helper to grab the token natively depending on the platform
  const getXsrfToken = (): string | null => {
    if (isServer) {
      // On server, read from cloned headers passed by the SSR Context Interceptor
      return req.headers.get("x-xsrf-token");
    }
    return tokenExtractor.getToken();
  };

  const token = getXsrfToken();

  // Helper function to fetch token from backend, read Set-Cookie, and retry
  const fetchCsrfAndRetry = () => {
    return http
      .get(`${environment.url.api}/csrf`, {
        withCredentials: true,
        observe: "response",
      })
      .pipe(
        switchMap((res) => {
          let nextToken = tokenExtractor.getToken() || "";

          // Server-side fallback parsing if cookies aren't automatically bound to the extractor
          if (isServer && !nextToken) {
            const cookies = res.headers.getAll("set-cookie") || [];
            for (const c of cookies) {
              const match = c.match(/^XSRF-TOKEN=([^;]+)/);
              if (match) nextToken = decodeURIComponent(match[1]);
            }
          }

          const retryReq = req.clone({
            headers: req.headers
              .set("X-XSRF-TOKEN", nextToken)
              .set("x-xsrf-token", nextToken),
            withCredentials: true,
          });
          return next(retryReq);
        }),
      );
  };

  // Rule 2: If token is present, append headers and proceed
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers
        .set("X-XSRF-TOKEN", token)
        .set("x-xsrf-token", token),
      withCredentials: true,
    });

    return next(clonedReq).pipe(
      catchError((error) => {
        // Handle token expiration/rotation (419 match)
        if (
          error instanceof HttpErrorResponse &&
          error.status === 419 &&
          !skipCsrfCheck
        ) {
          return fetchCsrfAndRetry();
        }
        return throwError(() => error);
      }),
    );
  }

  // Rule 3: If token is absent, hit /csrf endpoint first, then execute request
  if (!skipCsrfCheck) {
    return fetchCsrfAndRetry();
  }

  return next(req.clone({ withCredentials: true }));
};
