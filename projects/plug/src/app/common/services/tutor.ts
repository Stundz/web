import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, shareReplay, switchMap } from "rxjs";
import { Model, Paginated, toFormData } from "shared";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class Tutor {
	private _http = inject(HttpClient);

	params = new BehaviorSubject<Record<string, any>>({});
	params$ = this.params.asObservable();

	tutors$ = this.params$.pipe(
		switchMap((filters) => {
			const params = Object.fromEntries(
				Object.entries(filters).filter(([key, value]) =>
					key === "page" && value == 1 ? false : Boolean(value),
				),
			);

			return this._http.get<Paginated<Model.Plug.Tutorial>>(
				`https://api.${environment.domain}/plug/tutors`,
				{
					params,
				},
			);
		}),
		shareReplay(),
	);

	create(
		payload: Pick<
			Model.Plug.Tutor,
			"first_name" | "last_name" | "phone" | "endorsement"
		> & { courses: Array<Model.Plug.Course>; profile: File; transcript: File },
	) {
		return this._http.post<void>(
			`https://api.${environment.domain}/plug/tutor`,
			toFormData({ ...payload, courses: payload.courses.map((c) => c.id) }),
		);
	}
}
