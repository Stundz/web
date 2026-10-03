import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
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
  withIncrementalHydration,
} from "@angular/platform-browser";
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
  withViewTransitions,
} from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Auth } from "shared";
import { ENVIRONMENT } from "shared/types";
import { csrfInterceptor, stundzInterceptor } from "shared/interceptors";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includeRequestsWithCredentials: true,
        includeNonCacheableRequests: true,
      }),
    ),
    provideHttpClient(withInterceptors([stundzInterceptor, csrfInterceptor])),
    provideAppInitializer(async () => {
      const authService = inject(Auth);

      return await firstValueFrom(authService.getUser());
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
