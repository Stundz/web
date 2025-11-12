import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Model, Paginated, toFormData } from "shared";
import { BehaviorSubject, shareReplay, startWith, switchMap, tap } from "rxjs";

@Injectable()
export class Tutorial {
	private readonly _http = inject(HttpClient);
	filters = new BehaviorSubject<Record<string, any>>({});
	filters$ = this.filters.asObservable().pipe(shareReplay());

	tutorials$ = this.filters$.pipe(
		switchMap((filters) => {
			const params = Object.fromEntries(
				Object.entries(filters).filter(([key, value]) =>
					key === "page" && value == 1 ? false : Boolean(value),
				),
			);

			return this._http.get<Paginated<Model.Plug.Tutorial>>(
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
		return this._http.post<void>(
			`https://api.${environment.domain}/plug/tutorial`,
			toFormData(payload),
		);
	}

	addSession(
		tutorial: Model.Plug.Tutorial["id"],
		payload: Pick<Model.Plug.Session, "day" | "duration" | "objectives">,
	) {
		return this._http.post<void>(
			`https://api.${environment.domain}/plug/tutorial/${tutorial}/session`,
			toFormData(payload),
		);
	}
}
