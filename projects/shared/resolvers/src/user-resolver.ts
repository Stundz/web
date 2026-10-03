import type { User } from "shared/models";
import { inject } from "@angular/core";
import type { ResolveFn } from "@angular/router";
import { of, switchMap } from "rxjs";
import { Auth } from "shared/services";


export const userResolver: ResolveFn<User | null | undefined> = (
  route,
  state,
) => {
  const userService = inject(Auth);

  return userService.user$.pipe(
    switchMap((user) => {
      if (user === undefined) {
        return userService.getUser();
      }

      return of(user);
    }),
  );
};
