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
	withIncrementalHydration,
} from "@angular/platform-browser";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { ENVIRONMENT } from "shared";
import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes, withComponentInputBinding()),
		provideClientHydration(withEventReplay(), withIncrementalHydration()),
		provideHttpClient(withFetch()),
		{
			provide: ENVIRONMENT,
			useValue: environment,
		},
	],
};
