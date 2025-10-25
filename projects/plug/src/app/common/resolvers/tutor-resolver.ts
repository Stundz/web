import { HttpClient, httpResource } from "@angular/common/http";
import { ResolveFn } from "@angular/router";
import { Model } from "shared";
import { environment } from "../../../environments/environment";
import { pendingUntilEvent, toObservable } from "@angular/core/rxjs-interop";
import { catchError, EMPTY, filter, first, of, skip, tap } from "rxjs";
import { inject } from "@angular/core";

export const tutorResolver: ResolveFn<Model.Plug.Tutor | undefined> = (
	route,
	state,
) => {
	const http = inject(HttpClient);

	console.log(route.params);
	return route.paramMap.has("tutor")
		? http
				.get<Model.Plug.Tutor>(
					`https://api.${environment.domain}/plug/tutor/${route.paramMap.get("tutor")}`,
				)
				.pipe(
					pendingUntilEvent(),
					catchError((error) => of(undefined)),
				)
		: undefined;
};
