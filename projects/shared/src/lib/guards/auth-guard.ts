import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { type CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { map, of, switchMap, take } from "rxjs";
import { Auth } from "../services";
import { AUTH_GUARD_REDIRECT_PATH } from "../tokens";

export const authGuard: CanActivateFn = (route, state) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const redirectPath = inject(AUTH_GUARD_REDIRECT_PATH);

  const authService = inject(Auth);

  return authService.user$.pipe(
    take(1),
    // Take the current state emission
    switchMap((user) => {
      console.log({ user });
      // If user state is already in memory, use it
      if (user !== null && user !== undefined) {
        return of(true);
      }

      // If state is null, trigger getUser() to fetch from backend API (critical for initial SSR/Refreshes)
      if (user === undefined) {
        return authService.getUser().pipe(
          map((fetchedUser) => {
            if (fetchedUser !== null) {
              return true;
            }

            snackBar.open("You are unauthenticated");
            return new RedirectCommand(router.parseUrl(redirectPath));
          }),
        );
      }

      return of(new RedirectCommand(router.parseUrl(redirectPath)));
    }),
  );
};
