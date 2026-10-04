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
import { firstValueFrom } from "rxjs";
import { csrfInterceptor, stundzInterceptor } from "shared/interceptors";
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
