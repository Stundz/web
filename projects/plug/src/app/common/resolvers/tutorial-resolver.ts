import { inject, PLATFORM_ID } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Model, Paginated } from "shared";
import { Tutorial } from "../services/tutorial";
import { catchError, of } from "rxjs";
import { isPlatformServer } from "@angular/common";

export const tutorialsResolver: ResolveFn<Paginated<Model.Plug.Tutorial>> = (
	route,
	state,
) => {
	const tutorialService = inject(Tutorial);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformServer(platformId)) {
		return {
			data: [],
			meta: {
				per_page: 0,
				total: 0,
				current_page: 0,
				from: 0,
				to: 0,
			},
			links: {},
		};
	}

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
