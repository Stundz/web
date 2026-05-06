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
				meta.updateTag({
					id: "og:image",
					property: "og:image",
					content:
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
				});
				meta.updateTag({
					id: "og:image.url",
					property: "og:image",
					content:
						"http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
				});
				meta.updateTag({
					id: "og:image.secure_url",
					property: "og:image",
					content:
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
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
