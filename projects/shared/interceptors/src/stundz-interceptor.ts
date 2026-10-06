import { isPlatformServer } from "@angular/common";
import type { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { EMPTY } from "rxjs";
import { HTTP_SKIP_ON_SERVER } from "shared/contexts";

/**
 * Lets a request opt out of server-side execution via the HTTP_SKIP_ON_SERVER
 * context token. The request is dropped on the server and runs in the browser.
 *
 * Caveat: EMPTY completes without emitting, so never `firstValueFrom()` a
 * request flagged this way on the server (it would throw EmptyError).
 */
export const stundzInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.context.get(HTTP_SKIP_ON_SERVER) === true &&
    isPlatformServer(inject(PLATFORM_ID))
  ) {
    return EMPTY;
  }

  return next(req);
};
