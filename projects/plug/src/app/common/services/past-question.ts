import { HttpClient, HttpContext, httpResource } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
	HTTP_SKIP_ON_SERVER,
	Model,
	Paginated,
	toFormData,
	User,
} from "shared";

@Injectable({ providedIn: null })
export class PastQuestion {
	private _userService = inject(User);
	private _http = inject(HttpClient);
	readonly filters = signal<Record<string, any>>({});
	publisher = signal<string | undefined>(undefined);

	readonly pastQuestions = httpResource<Paginated<Model.Plug.PastQuestion>>(
		() => {
			const params = Object.fromEntries(
				Object.entries(this.filters()).filter(([key, value]) =>
					key === "page" && value == 1 ? false : Boolean(value),
				),
			);

			return {
				url: `https://api.${environment.domain}/plug/past-questions`,
				params,
				context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
			};
		},
		{
			defaultValue: {
				data: [],
				meta: {
					total: 0,
					per_page: 0,
					from: 0,
					to: 0,
					current_page: 0,
				},
				links: {},
			},
		},
	);

	myPastQuestions = httpResource<Paginated<Model.Plug.PastQuestion>>(
		() =>
			this.publisher() != undefined
				? {
						url: `https://api.${environment.domain}/plug/past-questions`,
						params: {
							publisher: this.publisher()!,
						},
						context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
					}
				: undefined,
		{
			defaultValue: {
				data: [],
				meta: {
					total: 0,
					per_page: 0,
					from: 0,
					to: 0,
					current_page: 0,
				},
				links: {},
			},
		},
	);

	create(payload: { course_id: string; file: File | null; year: number }) {
		return this._http.post<void>(
			`https://api.${environment.domain}/plug/past-question`,
			toFormData(payload),
		);
	}
}
