import type { User } from "shared/models";
import { inject } from "@angular/core";
import type { ResolveFn } from "@angular/router";
import { PremiflyUser } from "shared/services";
import type { Paginated } from "shared/types";

export const premiflyUsersResolver: ResolveFn<Paginated<User>> = (
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
