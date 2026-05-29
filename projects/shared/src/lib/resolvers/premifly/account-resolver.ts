import type { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { type ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY, of, throwError } from "rxjs";
import { PremiflyAccount } from "../../services";
import type { Model, Paginated } from "../../types";

export const premiflyAccountsResolver: ResolveFn<
	Paginated<Model.Premifly.Account>
> = (route, state) => {
	const service = inject(PremiflyAccount);

	service.params.set({
		...route.queryParams,
		page: route.queryParams["page"] || 1,
	});

	return service.accounts$.pipe(
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
			} as Paginated<Model.Premifly.Account>),
		),
	);
};

export const premiflyAccountResolver: ResolveFn<Model.Premifly.Account> = (
	route,
	state,
) => {
	const service = inject(PremiflyAccount);
	const router = inject(Router);

	return service.getAccount(route.params["account"]).pipe(
		catchError((response: HttpErrorResponse) => {
			if (response.status === 404) {
				router.navigateByUrl("**", { replaceUrl: false });
				return EMPTY;
			}
			return throwError(() => response);
		}),
	);
};
