import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { switchMap } from "rxjs";
import { ENVIRONMENT, type Model, type Paginated } from "../../types";

@Injectable({
	providedIn: "root",
})
export class PremiflyAccount<T = Paginated<Model.Premifly.Account>> {
	#environment = inject(ENVIRONMENT);
	#http = inject(HttpClient);
	params = signal<Record<string, string | boolean | number>>({});
	#params$ = toObservable(this.params);

	accounts$ = this.#params$.pipe(
		switchMap((params) =>
			this.#http.get<T>(`${this.#environment.url.api}/premifly/accounts`, {
				params,
			}),
		),
	);

	getAccount(id: Model.Premifly.Account["id"]) {
		return this.#http.get<Model.Premifly.Account>(
			`${this.#environment.url.api}/premifly/account/${id}`,
		);
	}

	create(body: Pick<Model.Premifly.Account, "email">) {
		return this.#http.post<Model.Premifly.Account>(
			`${this.#environment.url.api}/premifly/account`,
			body,
		);
	}

	update(
		id: Model.Premifly.Account["id"],
		payload: Partial<Pick<Model.Premifly.Account, "email">>,
	) {
		return this.#http.patch<Model.Premifly.Account>(
			`${this.#environment.url.api}/premifly/account/${id}`,
			payload,
		);
	}

	delete(id: Model.Premifly.Account["id"]) {
		return this.#http.delete<unknown>(
			`${this.#environment.url.api}/premifly/account/${id}`,
		);
	}
}
