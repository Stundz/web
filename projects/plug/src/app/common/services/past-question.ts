import { HttpClient, HttpContext } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HTTP_SKIP_ON_SERVER, Model, Paginated, toFormData } from "shared";
import { toObservable } from "@angular/core/rxjs-interop";
import {
	BehaviorSubject,
	distinctUntilChanged,
	filter,
	startWith,
	switchMap,
} from "rxjs";

@Injectable({ providedIn: null })
export class PastQuestion {
	private _http = inject(HttpClient);
	readonly filters = signal<Record<string, any>>({});
	publisher = signal<string | undefined>(undefined);

	private _filters = new BehaviorSubject<Record<string, any>>({});

	pastQuestions$ = this._filters.asObservable().pipe(
		switchMap((filters) => {
			const params = Object.fromEntries(
				Object.entries(filters).filter(([key, value]) =>
					key === "page" && value == 1 ? false : Boolean(value),
				),
			);

			return this._http.get<Paginated<Model.Plug.PastQuestion>>(
				`https://api.${environment.domain}/plug/past-questions`,
				{
					params,
					// context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
				},
			);
		}),
	);

	myPastQuestions$ = toObservable(this.publisher).pipe(
		filter((publisher) => publisher != undefined),
		distinctUntilChanged(),
		switchMap((publisher) =>
			this._http.get<Paginated<Model.Plug.PastQuestion>>(
				`https://api.${environment.domain}/plug/past-questions`,
				{
					params: {
						publisher,
					},
				},
			),
		),
	);

	constructor() {
		effect(() => {
			this._filters.next(this.filters());
		});
	}

	create(payload: { course_id: string; file: File | null; year: number }) {
		return this._http.post<void>(
			`https://api.${environment.domain}/plug/past-question`,
			toFormData(payload),
		);
	}
}
