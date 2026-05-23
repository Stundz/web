import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { switchMap } from "rxjs";
import { ENVIRONMENT, type Model, type Paginated } from "../../types";

@Injectable({
	providedIn: "root",
})
export class PremiflyUser<T = Paginated<Model.Premifly.User>> {
	#environment = inject(ENVIRONMENT);
	#http = inject(HttpClient);
	params = signal<Record<string, string | boolean | number>>({});
	#params$ = toObservable(this.params);

	users$ = this.#params$.pipe(
		switchMap((params) =>
			this.#http.get<T>(`${this.#environment.url.api}/premifly/users`, {
				params,
			}),
		),
	);

	getUser(id: Model.Premifly.User["id"]) {
		return this.#http.get<Model.Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}`,
		);
	}

	create(body: any) {
		return this.#http.post<Model.Premifly.User>(
			`${this.#environment.url.api}/premifly/user`,
			body,
		);
	}

	update(id: Model.Premifly.User["id"], payload: any) {
		return this.#http.patch<Model.Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}`,
			payload,
		);
	}

	getSubscriptions(id: Model.Premifly.User["id"]) {
		return this.#http.get<Model.Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}/subscriptions`,
		);
	}

	getAccounts(id: Model.Premifly.User["id"]) {
		return this.#http.get<Model.Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}/accounts`,
		);
	}

	getSubscribers(id: Model.Premifly.User["id"]) {
		return this.#http.get<Model.Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}/subscribers`,
		);
	}

	delete(id: Model.Premifly.User["id"]) {
		return this.#http.delete<unknown>(
			`${this.#environment.url.api}/premifly/user/${id}`,
		);
	}
}
