import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Session } from "../services/session";

export const sessionsResolver: ResolveFn<any[]> = (
	route: ActivatedRouteSnapshot,
) => {
	return inject(Session).getSessions(route.paramMap.get("tutorial")!);
};

export const sessionResolver: ResolveFn<any> = (
	route: ActivatedRouteSnapshot,
) => {
	return inject(Session).getSession(
		route.paramMap.get("tutorial")!,
		route.paramMap.get("session")!,
	);
};
