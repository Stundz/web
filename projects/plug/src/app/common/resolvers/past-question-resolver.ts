import { inject, PLATFORM_ID } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Model, Paginated } from "shared";
import { PastQuestion } from "../services/past-question";
import { catchError, of } from "rxjs";
import { isPlatformServer } from "@angular/common";

export const pastQuestionResolver: ResolveFn<
	Paginated<Model.Plug.PastQuestion>
> = (route, state) => {
	const pastQuestionService = inject(PastQuestion);
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

	return pastQuestionService.pastQuestions$.pipe(
		catchError(() => {
			return of({
				data: [],
				meta: {
					total: 0,
					current_page: 0,
					per_page: 0,
					from: 0,
					to: 0,
				},
				links: {},
			} as Paginated<Model.Plug.PastQuestion>);
		}),
	);
};
