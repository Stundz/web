import { isPlatformServer } from "@angular/common";
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  type HttpInterceptorFn,
  HttpXsrfTokenExtractor,
} from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { ENVIRONMENT } from "../types";

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const environment = inject(ENVIRONMENT);
  const tokenExtractor = inject(HttpXsrfTokenExtractor);
  const platformId = inject(PLATFORM_ID);
  const http = new HttpClient(inject(HttpBackend));

  // 1. Only intercept if the request matches your API pattern
  if (!/^https?:\/\/api\.stundz\./i.test(req.url)) {
    return next(req);
  }

  console.log((req.headers as any).keys());

  const isServer = isPlatformServer(platformId);
  const skipCsrfCheck = ["/user"].some((path) => req.url.endsWith(path));

  // Safely extract token using Angular public APIs
  const getXsrfToken = (): string | null => {
    console.log(req.url);
    if (isServer) {
      console.log("IN server");
      // Pulls cleanly from the headers that your SSR interceptor transferred over
      return req.headers.get("x-xsrf-token");
    }
    console.log("is client");
    return tokenExtractor.getToken();
  };

  const token = getXsrfToken();

  // Unified logic to fetch a missing/expired token and retry safely
  const fetchCsrfAndRetry = () => {
    return http
      .get(`${environment.url.api}/csrf`, {
        withCredentials: true,
        observe: "response",
      })
      .pipe(
        switchMap((res) => {
          let nextToken = tokenExtractor.getToken() || "";

          console.log("nextToken", nextToken);

          if (isServer && !nextToken) {
            const cookies = res.headers.getAll("SET-COOKIE") || [];
            for (const c of cookies) {
              const match = c.match(/^XSRF-TOKEN=([^;]+)/);
              if (match) nextToken = decodeURIComponent(match[1]);
            }
          }

          // Use native .set() chains. Never pass an object containing lazyInit properties to setHeaders
          const retryHeaders = req.headers.set("X-XSRF-TOKEN", nextToken);

          return next(
            req.clone({ headers: retryHeaders, withCredentials: true }),
          );
        }),
      );
  };

  // 2. Token exists: Append using native immutable API chains
  if (token) {
    const authorizedHeaders = req.headers.set("X-XSRF-TOKEN", token);

    return next(
      req.clone({
        headers: authorizedHeaders,
        withCredentials: true,
      }),
    ).pipe(
      catchError((error) => {
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

  // 3. Token is completely absent: Fetch it first
  if (!skipCsrfCheck) {
    return fetchCsrfAndRetry();
  }

  return next(req.clone({ withCredentials: true }));
};
