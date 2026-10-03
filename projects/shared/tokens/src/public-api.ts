import { InjectionToken } from "@angular/core";

/** Configurable redirect path for authentication guards. Defaults to the app root. */
export const AUTH_GUARD_REDIRECT_PATH = new InjectionToken<string>(
  "AUTH_GUARD_REDIRECT_PATH",
  {
    providedIn: "root",
    factory: () => "/",
  },
);
