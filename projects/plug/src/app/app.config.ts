import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
  type ApplicationConfig,
  enableProdMode,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from "@angular/platform-browser";
import {
  provideRouter,
  withComponentInputBinding,
  withRouterResources,
  withViewTransitions,
} from "@angular/router";
import { catchError, firstValueFrom, tap, throwError } from "rxjs";
import {
  browserInterceptor,
  serverInterceptor,
  stundzInterceptor,
} from "shared/interceptors";
import { Auth } from "shared/services";
import { ENVIRONMENT } from "shared/types";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withRouterResources(),
    ),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        filter: (req) =>
          new RegExp(`^https?://api.${environment.domain}`).test(req.url),
        includeRequestsWithCredentials: true,
        includeNonCacheableRequests: true,
        includeRequestsWithAuthHeaders: true,
      }),
    ),
    provideHttpClient(
      withInterceptors([
        stundzInterceptor,
        serverInterceptor,
        browserInterceptor,
      ]),
    ),
    provideAppInitializer(async () => {
      const authService = inject(Auth);

      return await firstValueFrom(
        authService.getUser().pipe(
          tap(() => console.log("Getting the user")),
          catchError((error) => {
            console.log("Error caught while getting user");

            return throwError(() => error);
          }),
        ),
      );
    }),
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },
  ],
};
