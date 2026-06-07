import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
  type ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from "@angular/router";
import { firstValueFrom } from "rxjs";
import {
  Auth,
  csrfInterceptor,
  ENVIRONMENT,
  ssrInterceptor,
  stundzInterceptor,
} from "shared";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([stundzInterceptor, ssrInterceptor, csrfInterceptor]),
    ),
    provideAppInitializer(async () => {
      const authService = inject(Auth);

      return await firstValueFrom(authService.getUser());
    }),
    { provide: DEFAULT_CURRENCY_CODE, useValue: "XAF" },
    {
      provide: LOCALE_ID,
      useValue: "en-CM",
    },
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
