import { inject, PLATFORM_ID } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { Model, Paginated } from "shared";
import { PastQuestion } from "../services/past-question";
import { catchError, EMPTY, of, throwError } from "rxjs";
import { isPlatformServer } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export const pastQuestionsResolver: ResolveFn<
	Paginated<Model.Plug.PastQuestion>
> = (route, state) => {
	const pastQuestionService = inject(PastQuestion);

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

export const pastQuestionResolver: ResolveFn<Model.Plug.PastQuestion> = (
	route,
	state,
) => {
	const http = inject(HttpClient);
	const router = inject(Router);

	return http
		.get<Model.Plug.PastQuestion>(
			`https://api.${environment.domain}/plug/past-question/${route.params["past-question"]}`,
		)
		.pipe(
			catchError((response: HttpErrorResponse) => {
				if (response.status === 404) {
					router.navigateByUrl("/past-question/**");

					return EMPTY;
				}

				return throwError(() => response);
			}),
		);
};
