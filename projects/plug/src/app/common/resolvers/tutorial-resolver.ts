import { inject, PLATFORM_ID } from "@angular/core";
import { RedirectCommand, ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY, of, tap, throwError } from "rxjs";
import { Model, Paginated } from "shared";
import { Tutorial } from "../services/tutorial";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export const tutorialsResolver: ResolveFn<Paginated<Model.Plug.Tutorial>> = (
	route,
	state,
) => {
	const tutorialService = inject(Tutorial);
	const platformId = inject(PLATFORM_ID);

	// if (isPlatformServer(platformId)) {
	// 	return {
	// 		data: [],
	// 		meta: {
	// 			per_page: 0,
	// 			total: 0,
	// 			current_page: 0,
	// 			from: 0,
	// 			to: 0,
	// 		},
	// 		links: {},
	// 	};
	// }

	return tutorialService.tutorials$.pipe(
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
			} as Paginated<Model.Plug.Tutorial>),
		),
	);
};

export const tutorialResolver: ResolveFn<Model.Plug.Tutorial> = (
	route,
	state,
) => {
	const http = inject(HttpClient);
	const router = inject(Router);

	return http
		.get<Model.Plug.Tutorial>(
			`http://api.${environment.domain}/plug/tutorial/${route.params["tutorial"]}`,
		)
		.pipe(
			catchError((response: HttpErrorResponse) => {
				if (response.status === 404) {
					router.navigateByUrl("**", { replaceUrl: false });
					return EMPTY;
				}
				return throwError(() => response);
			}),
		);
};
