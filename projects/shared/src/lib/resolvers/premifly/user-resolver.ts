import { inject } from "@angular/core";
import type { ResolveFn } from "@angular/router";
import { PremiflyUser } from "../../services";
import type { Model, Paginated } from "../../types";

export const premiflyUsersResolver: ResolveFn<Paginated<Model.User>> = (
	route,
	state,
) => {
	const userService = inject(PremiflyUser);

	userService.params.set({
		...route.queryParams,
		page: route.queryParams["page"] || 1,
	});

	return userService.users$;
};

export const premiflyUserResolver: ResolveFn<boolean> = (route, state) => {
	return true;
};
