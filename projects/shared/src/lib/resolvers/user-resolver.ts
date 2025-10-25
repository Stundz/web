import { toObservable } from "@angular/core/rxjs-interop";
import { ResolveFn } from "@angular/router";
import { User } from "../services";
import { effect, inject, PLATFORM_ID, resource } from "@angular/core";
import { catchError, EMPTY, filter, first, map, of, tap } from "rxjs";
import { Model } from "../types";
import { isPlatformServer } from "@angular/common";

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
