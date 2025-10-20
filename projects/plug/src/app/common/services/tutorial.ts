import { HttpClient, httpResource } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Model, toFormData } from "shared";

@Injectable()
export class Tutorial {
	private readonly _http = inject(HttpClient);

	tutorials = httpResource(() => ({
		url: `https://api.${environment.domain}/plug/tutorials`,
	}));

	create(
		payload: Pick<
			Model.Tutorial,
			| "name"
			| "description"
			| "duration"
			| "objectives"
			| "course_id"
			| "day"
			| "time"
			| "price"
		> & {
			cover: File | undefined;
		},
	) {
		return this._http.post<void>(
			`https://api.${environment.domain}/plug/tutorial`,
			toFormData(payload),
		);
	}
}
