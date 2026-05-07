import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
	type ApplicationConfig,
	provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import {
	provideClientHydration,
	withEventReplay,
} from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { csrfInterceptor, ENVIRONMENT, stundzInterceptor } from "shared";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		provideHttpClient(withInterceptors([stundzInterceptor, csrfInterceptor])),
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
