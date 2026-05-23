import type { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { type ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY, of, throwError } from "rxjs";
import { PremiflyService } from "../../services";
import type { Model, Paginated } from "../../types";

export const premiflyServicesResolver: ResolveFn<
	Paginated<Model.Premifly.Service>
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
			} as Paginated<Model.Premifly.Service>),
		),
	);
};

export const premiflyServiceResolver: ResolveFn<Model.Premifly.Service> = (
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
	Paginated<Model.User & { premifly_accounts: Array<Model.Premifly.Account> }>
> = (route, state) => {
	const service =
		inject<PremiflyService<Paginated<Model.Premifly.Service>>>(PremiflyService);
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
