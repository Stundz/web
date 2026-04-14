import { inject } from "@angular/core";
import type { ResolveFn } from "@angular/router";
import { Auth } from "../services";
import type { Model } from "../types";

export const userResolver: ResolveFn<Model.User | null> = (route, state) => {
	const userService = inject(Auth);

	return userService.user$.pipe();
};
