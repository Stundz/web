import { isPlatformServer } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { catchError, of } from "rxjs";
import { User } from "../services";
import { Model } from "../types";

export const userResolver: ResolveFn<Model.User | undefined> = (
	route,
	state,
) => {
	const userService = inject(User);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformServer(platformId)) {
		return undefined;
	}

	return userService.user$.pipe(catchError(() => of(undefined)));
};
