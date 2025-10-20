import { HttpClient, HttpContext, httpResource } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HTTP_SKIP_ON_SERVER, Model, Paginated, toFormData } from "shared";

@Injectable({ providedIn: null })
export class PastQuestion {
	private _http = inject(HttpClient);
	readonly filters = signal<Record<string, any>>({});

	readonly pastQuestions = httpResource<Paginated<Model.PastQuestion>>(
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

	create(payload: { course_id: string; file: File | null; year: number }) {
		return this._http.post<void>(
			`https://api.${environment.domain}/plug/past-question`,
			toFormData(payload),
		);
	}
}
