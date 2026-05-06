import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { BehaviorSubject, shareReplay, startWith, switchMap, tap } from "rxjs";
import { type Model, type Paginated, toFormData } from "shared";
import { environment } from "../../../environments/environment";
import { Session } from "./session";

@Injectable()
export class Tutorial {
	#http = inject(HttpClient);
	#sessionService = inject(Session);
	filters = new BehaviorSubject<Record<string, any>>({});
	filters$ = this.filters.asObservable().pipe(shareReplay());

	tutorials$ = this.filters$.pipe(
		switchMap((filters) => {
			const params = Object.fromEntries(
				Object.entries(filters).filter(([key, value]) =>
					key === "page" && value == 1 ? false : Boolean(value),
				),
			);

			return this.#http.get<Paginated<Model.Plug.Tutorial>>(
				`${environment.production ? "https" : "http"}://api.${environment.domain}/plug/tutorials`,
				{
					params,
				},
			);
		}),
		shareReplay(),
	);

	create(
		payload: Pick<
			Model.Plug.Tutorial,
			"name" | "description" | "course_id" | "price"
		>,
	) {
		return this.#http.post<void>(
			`https://api.${environment.domain}/plug/tutorial`,
			toFormData(payload),
		);
	}

	addSession(
		tutorial: Model.Plug.Tutorial["id"],
		payload: Pick<Model.Plug.Session, "day" | "duration" | "objectives">,
	) {
		return this.#http.post<void>(
			`https://api.${environment.domain}/plug/tutorial/${tutorial}/session`,
			toFormData(payload),
		);
	}

	getSession(id: string) {
		return this.#sessionService.getSession(id);
	}
}
