import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";
import {
	provideClientHydration,
	withEventReplay,
} from "@angular/platform-browser";
import {
	provideHttpClient,
	withFetch,
	withInterceptors,
} from "@angular/common/http";
import { ENVIRONMENT, stundzInterceptor } from "shared";
import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes, withComponentInputBinding()),
		provideClientHydration(withEventReplay()),
		provideHttpClient(withFetch(), withInterceptors([stundzInterceptor])),
		{
			provide: ENVIRONMENT,
			useValue: environment,
		},
	],
};
