import { HttpClient, httpResource } from "@angular/common/http";
import { ResolveFn } from "@angular/router";
import { Model } from "shared";
import { environment } from "../../../environments/environment";
import { pendingUntilEvent, toObservable } from "@angular/core/rxjs-interop";
import { catchError, EMPTY, filter, first, of, skip, tap } from "rxjs";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformServer } from "@angular/common";

export const tutorResolver: ResolveFn<Model.Plug.Tutor | undefined> = (
	route,
	state,
) => {
	const http = inject(HttpClient);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformServer(platformId)) {
		return undefined;
	}

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
