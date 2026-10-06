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
import { ENVIRONMENT } from "shared/types";

const CSRF_HEADER = "X-XSRF-TOKEN";

/** Endpoints that never trigger a /csrf fetch (nor a retry on 419). */
const SKIP_CSRF_FETCH = ["/user"];

/**
 * BROWSER ONLY. Attaches the XSRF token and cookies to API calls, and
 * obtains/refreshes the XSRF cookie through /csrf when needed.
 *
 * On the server it does nothing: serverInterceptor already supplies the cookie
 */
export const browserInterceptor: HttpInterceptorFn = (req, next) => {
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return next(req);
  }

  const environment = inject(ENVIRONMENT);

  if (!req.url.startsWith(environment.url.api)) {
    return next(req);
  }

  const tokenExtractor = inject(HttpXsrfTokenExtractor);
  const httpBackend = inject(HttpBackend);

  const canFetchCsrf = !SKIP_CSRF_FETCH.some((path) => req.url.endsWith(path));

  const send = (token: string | null) =>
    next(
      req.clone({
        withCredentials: true,
        setHeaders: token ? { [CSRF_HEADER]: token } : {},
      }),
    );

  // Uses HttpBackend directly so this call skips every interceptor (no recursion).
  // The browser stores the XSRF-TOKEN cookie from the response by itself.
  const refreshAndSend = () =>
    new HttpClient(httpBackend)
      .get(`${environment.url.api}/csrf`, {
        withCredentials: true,
        responseType: "text",
      })
      .pipe(switchMap(() => send(tokenExtractor.getToken())));

  const token = tokenExtractor.getToken();

  if (!token) {
    return canFetchCsrf ? refreshAndSend() : send(null);
  }

  return send(token).pipe(
    catchError((error: unknown) =>
      error instanceof HttpErrorResponse && error.status === 419 && canFetchCsrf
        ? refreshAndSend()
        : throwError(() => error),
    ),
  );
};
