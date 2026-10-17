import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { type CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { of, switchMap, tap } from "rxjs";
import { Auth } from "shared/services";

export const guestGuard: CanActivateFn = (_route, _state) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  // const redirectPath = inject(AUTH_GUARD_REDIRECT_PATH);

  const authService = inject(Auth);

  return authService.user$.pipe(
    // Take the current state emission
    switchMap((user) => {
      // If user state is already in memory, use it
      if (!user) {
        return of(true);
      }

      return of(new RedirectCommand(router.parseUrl("/")));
    }),
    tap(() => {
      snackBar.open("Please login to proceed", "login", {});
    }),
  );
};
