import { isPlatformServer } from "@angular/common";
import {
	provideHttpClient,
	withFetch,
	withInterceptors,
} from "@angular/common/http";
import {
	type ApplicationConfig,
	enableProdMode,
	inject,
	PLATFORM_ID,
	provideAppInitializer,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import {
	provideClientHydration,
	withEventReplay,
	withIncrementalHydration,
} from "@angular/platform-browser";
import {
	provideRouter,
	withComponentInputBinding,
	withRouterConfig,
} from "@angular/router";
import { catchError, firstValueFrom, of } from "rxjs";
import { Auth, csrfInterceptor, ENVIRONMENT, stundzInterceptor } from "shared";
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
			withRouterConfig({
				paramsInheritanceStrategy: "always",
			}),
		),
		provideClientHydration(withEventReplay(), withIncrementalHydration()),
		provideHttpClient(
			withFetch(),
			withInterceptors([stundzInterceptor, csrfInterceptor]),
		),
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
