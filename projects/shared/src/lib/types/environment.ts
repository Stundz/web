import { InjectionToken } from "@angular/core";

const domain = "stundz.com";

export interface ENVIRONMENT extends Record<string, any> {
	domain: string;
	production: boolean;
}

export const ENVIRONMENT = new InjectionToken<ENVIRONMENT>("ENVIRONMENT");
