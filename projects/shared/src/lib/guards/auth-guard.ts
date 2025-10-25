import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { User } from "../services";
import { isPlatformBrowser } from "@angular/common";
import { toObservable } from "@angular/core/rxjs-interop";
import { map, startWith } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

export const authGuard: CanActivateFn = (route, state) => {
	const platformId = inject(PLATFORM_ID);
	const snackBar = inject(MatSnackBar);
	const userService = inject(User);

	console.log("guarding");

	return true;
};
