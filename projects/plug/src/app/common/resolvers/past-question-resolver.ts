import { inject, PLATFORM_ID } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { Model, Paginated } from "shared";
import { PastQuestion } from "../services/past-question";
import { catchError, EMPTY, of, tap, throwError } from "rxjs";
import { isPlatformServer } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Meta, Title } from "@angular/platform-browser";

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
	const title = inject(Title);
	const meta = inject(Meta);

	return http
		.get<Model.Plug.PastQuestion>(
			`https://api.${environment.domain}/plug/past-question/${route.params["past-question"]}`,
		)
		.pipe(
			tap((question) => {
				const pageTitle = `${question.course.code} ${question.course.title}, ${question.year}`;
				const description = `${question.course.code} ${question.course?.title}. Past question and solutions.`;
				title.setTitle(pageTitle);

				meta.updateTag({
					id: "og:title",
					property: "og:title",
					content: pageTitle,
				});

				meta.updateTag({
					id: "og:description",
					property: "og:description",
					content: description,
				});
			}),
			catchError((response: HttpErrorResponse) => {
				if (response.status === 404) {
					router.navigateByUrl("/past-question/**");

					return EMPTY;
				}

				return throwError(() => response);
			}),
		);
};
