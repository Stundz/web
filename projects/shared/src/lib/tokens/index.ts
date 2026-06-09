import { InjectionToken } from "@angular/core";

export const AUTH_GUARD_REDIRECT_PATH = new InjectionToken<string>(
  "AUTH_GUARD_REDIRECT_PATH",
  {
    providedIn: "root",
    factory: () => "/",
  },
);
