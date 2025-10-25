import { HttpClient, httpResource } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Model, Paginated, toFormData } from "shared";

@Injectable()
export class Tutorial {
	private readonly _http = inject(HttpClient);

	tutorials$ = this._http.get<Paginated<Model.Plug.Tutorial>>(
		`https://api.${environment.domain}/plug/tutorials`,
	);

	create(
		payload: Pick<
			Model.Plug.Tutorial,
			"name" | "description" | "course_id" | "price"
		> & {
			cover: File | undefined;
		},
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
