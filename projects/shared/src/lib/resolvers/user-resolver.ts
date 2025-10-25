import { toObservable } from "@angular/core/rxjs-interop";
import { ResolveFn } from "@angular/router";
import { User } from "../services";
import { effect, inject, resource } from "@angular/core";
import { catchError, EMPTY, filter, first, map, tap } from "rxjs";
import { Model } from "../types";

export const userResolver: ResolveFn<Model.User | undefined> = (
	route,
	state,
) => {
	const userService = inject(User);

	console.log("resolving");

	return userService.gUser().pipe(
		first(), // Complete after first emission
		tap({
			next: (user) => console.log(`we got ${user?.first_name} from resolver`),
			error: () => console.log("failed retrieving userdata"),
		}),
		catchError((error) => {
			console.error("Resolver error:", error);
			return EMPTY; // Allows navigation to continue even on error
		}),
	);

	userService.getUser();

	return toObservable(userService.user.value).pipe(
		filter((user) => user != undefined),
		first(),
		tap({
			next: (user) => console.log(`we got ${user?.first_name} from resolver`),
			error: () => console.log("failed retrieving userdata"),
		}),
	);
};
