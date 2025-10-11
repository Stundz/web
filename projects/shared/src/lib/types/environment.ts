import { InjectionToken } from "@angular/core";

const domain = "stundz.com";

export interface ENVIRONMENT extends Record<string, any> {
	url: {
		base: string;
		plug: string;
		api: string;
	};
	production: boolean;
}

export const ENVIRONMENT = new InjectionToken<ENVIRONMENT>("ENVIRONMENT");
