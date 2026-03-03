import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { pendingUntilEvent } from "@angular/core/rxjs-interop";
import { Meta, Title } from "@angular/platform-browser";
import type { ResolveFn } from "@angular/router";
import { catchError, of, tap } from "rxjs";
import type { Model } from "shared";
import { environment } from "../../../environments/environment";

export const tutorResolver: ResolveFn<Model.Plug.Tutor | undefined> = (
	route,
	state,
) => {
	const http = inject(HttpClient);
	const title = inject(Title);
	const meta = inject(Meta);

	return route.paramMap.has("tutor")
		? http
				.get<Model.Plug.Tutor>(
					`https://api.${environment.domain}/plug/tutor/${route.paramMap.get("tutor")}`,
				)
				.pipe(
					pendingUntilEvent(),
					tap((tutor) => {
						const description = `Learn with ${tutor.first_name} ${tutor.last_name}, a certified plug following the ${tutor?.user?.level?.program?.name} Program in the ${tutor?.user?.department?.faculty?.institution.name} and lecturing ${tutor.courses
							?.map((c) => c.code)
							.join(", ")}`;
						const t = `${tutor.first_name} ${tutor.last_name}, Plug tutor and mentor`;

						title.setTitle(t);

						meta.updateTag({
							id: "og:title",
							property: "og:title",
							content: t,
						});
						meta.updateTag({
							id: "keywords",
							name: "keywords",
							content: `plug, tutor, mentor, ${tutor.first_name.trim().replace(/ /g, ", ")}, ${tutor.last_name.trim().replace(/ /g, ", ")}, ${tutor?.courses
								?.map((c) => c.title)
								.join(", ")}`,
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
					catchError((error) => of(undefined)),
				)
		: undefined;
};
