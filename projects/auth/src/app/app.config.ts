import {
	provideHttpClient,
	withFetch,
	withInterceptors,
} from "@angular/common/http";
import {
	type ApplicationConfig,
	inject,
	provideAppInitializer,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from "@angular/core";
import {
	MAT_FORM_FIELD_DEFAULT_OPTIONS,
	type MatFormFieldDefaultOptions,
} from "@angular/material/form-field";
import {
	provideClientHydration,
	withEventReplay,
} from "@angular/platform-browser";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Auth, csrfInterceptor, ENVIRONMENT, stundzInterceptor } from "shared";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes, withComponentInputBinding()),
		provideClientHydration(withEventReplay()),
		provideHttpClient(withFetch(), withInterceptors([csrfInterceptor])),
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
			useValue: { appearance: "outline" } as MatFormFieldDefaultOptions,
		},
	],
};
