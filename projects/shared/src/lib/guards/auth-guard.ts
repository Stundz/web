import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import type { CanActivateFn } from "@angular/router";
import { map, of, switchMap, take } from "rxjs";
import { Auth } from "../services";

export const authGuard: CanActivateFn = (route, state) => {
  const snackBar = inject(MatSnackBar);

  const authService = inject(Auth);

  return authService.user$.pipe(
    take(1),
    // Take the current state emission
    switchMap((user) => {
      console.log(user);
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
            return false;
          }),
        );
      }

      return of(false);
    }),
  );
};
