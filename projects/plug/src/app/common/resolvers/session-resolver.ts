import type { Plug } from "shared/models";
import { inject } from "@angular/core";
import type { ResolveFn } from "@angular/router";

import { Session } from "../services/session";

export const sessionResolver: ResolveFn<Plug.Session> = (
	route,
	state,
) => {
	const sessionService = inject(Session);

	return sessionService.getSession(route.params["session"]);
};
