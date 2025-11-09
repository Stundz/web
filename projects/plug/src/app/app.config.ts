import {
	ApplicationConfig,
	enableProdMode,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from "@angular/core";
import {
	provideRouter,
	withComponentInputBinding,
	withRouterConfig,
} from "@angular/router";

import { routes } from "./app.routes";
import {
	provideClientHydration,
	withEventReplay,
	withIncrementalHydration,
} from "@angular/platform-browser";
import {
	provideHttpClient,
	withFetch,
	withInterceptors,
} from "@angular/common/http";
import { ENVIRONMENT, stundzInterceptor } from "shared";
import { environment } from "../environments/environment";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

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
		provideHttpClient(withFetch(), withInterceptors([stundzInterceptor])),
		{
			provide: ENVIRONMENT,
			useValue: environment,
		},
		// {
		// 	provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
		// 	useValue: { appearance: "outline" },
		// },
	],
};
