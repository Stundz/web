import { inject } from "@angular/core";
import type { ResolveFn } from "@angular/router";
import type { Model } from "shared";
import { Session } from "../services/session";

export const sessionResolver: ResolveFn<Model.Plug.Session> = (
	route,
	state,
) => {
	const sessionService = inject(Session);

	return sessionService.getSession(route.params["session"]);
};
