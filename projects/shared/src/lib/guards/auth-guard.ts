import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "../services";
import { catchError, map, of } from "rxjs";
import { isPlatformServer } from "@angular/common";

export const authGuard: CanActivateFn = (route, state) => {
	const snackBar = inject(MatSnackBar);
	const guestPath = inject(Router).parseUrl("/");
	const userService = inject(User);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformServer(platformId)) {
		return true;
	}

	return userService.user$.pipe(
		map((user) => !!user),
		catchError(() => {
			snackBar.open("You are unauthenticated");
			return of(new RedirectCommand(guestPath));
		}),
	);
};
