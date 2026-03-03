import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { type ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY, of, tap, throwError } from "rxjs";
import type { Model, Paginated } from "shared";
import { environment } from "../../../environments/environment";
import { Tutorial } from "../services/tutorial";

export const tutorialsResolver: ResolveFn<Paginated<Model.Plug.Tutorial>> = (
	route,
	state,
) => {
	const tutorialService = inject(Tutorial);

	const params = { ...route.queryParams };

	if (route.data["user"]) {
		params["institution"] = (
			route.data["user"] as Model.User
		)?.plug?.department?.faculty.institution_id;
	}

	tutorialService.filters.next(params);

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
	const title = inject(Title);
	const meta = inject(Meta);

	return http
		.get<Model.Plug.Tutorial>(
			`https://api.${environment.domain}/plug/tutorial/${route.params["tutorial"]}`,
		)
		.pipe(
			tap((tutorial) => {
				const description = tutorial.description.slice(0, 157);
				title.setTitle(tutorial.name);
				meta.updateTag({
					id: "og:title",
					property: "og:title",
					content: tutorial.name,
				});
				meta.updateTag({
					id: "keywords",
					name: "keywords",
					content: `plug, tutorials, tutorial, ${tutorial.name.replace(/ /g, ", ")}, ${tutorial.course?.title.replace(/ /g, ", ")}`,
				});
				meta.updateTag({
					id: "description",
					name: "description",
					content: description,
				});
				meta.updateTag({
					id: "og:description",
					property: "og:description",
					content: description,
				});
				meta.updateTag({
					id: "og:url",
					property: "og:url",
					content: `https://plug.${environment.domain}${state.url}`,
				});
			}),
			catchError((response: HttpErrorResponse) => {
				if (response.status === 404) {
					router.navigateByUrl("**", { replaceUrl: false });
					return EMPTY;
				}
				return throwError(() => response);
			}),
		);
};
