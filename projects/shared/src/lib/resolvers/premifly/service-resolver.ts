import type { Premifly, User } from "shared/models";
import type { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { type ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY, of, throwError } from "rxjs";
import { PremiflyService } from "../../services";
import type { Paginated } from "../../types";

export const premiflyServicesResolver: ResolveFn<
	Paginated<Premifly.Service>
> = (route, state) => {
	const service = inject(PremiflyService);

	service.params.set({
		...route.queryParams,
		page: route.queryParams["page"] || 1,
	});

	return service.services$.pipe(
		catchError(() =>
			of({
				data: [],
				meta: {
					per_page: 0,
					total: 0,
					current_page: 0,
					from: 0,
					to: 0,
				},
				links: {},
			} as Paginated<Premifly.Service>),
		),
	);
};

export const premiflyServiceResolver: ResolveFn<Premifly.Service> = (
	route,
	state,
) => {
	const service = inject(PremiflyService);
	const router = inject(Router);

	return service.getService(route.params["service"]).pipe(
		catchError((response: HttpErrorResponse) => {
			if (response.status === 404) {
				router.navigateByUrl("**", { replaceUrl: false });
				return EMPTY;
			}
			return throwError(() => response);
		}),
	);
};

export const premiflyServiceSubscribersResolver: ResolveFn<
	Paginated<User & { premifly_accounts: Array<Premifly.Account> }>
> = (route, state) => {
	const service =
		inject<PremiflyService<Paginated<Premifly.Service>>>(PremiflyService);
	const router = inject(Router);

	return service.getSubscribers(route.params["service"]).pipe(
		catchError((response: HttpErrorResponse) => {
			if (response.status === 404) {
				router.navigateByUrl("**", { replaceUrl: false });
				return EMPTY;
			}
			return throwError(() => response);
		}),
	);
};
