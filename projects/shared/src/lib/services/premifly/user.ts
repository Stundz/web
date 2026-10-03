import type { Premifly } from "shared/models";
import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { switchMap } from "rxjs";
import { ENVIRONMENT, type Paginated } from "../../types";

@Injectable({
	providedIn: "root",
})
export class PremiflyUser<T = Paginated<Premifly.User>> {
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

	getUser(id: Premifly.User["id"]) {
		return this.#http.get<Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}`,
		);
	}

	create(body: any) {
		return this.#http.post<Premifly.User>(
			`${this.#environment.url.api}/premifly/user`,
			body,
		);
	}

	update(id: Premifly.User["id"], payload: any) {
		return this.#http.patch<Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}`,
			payload,
		);
	}

	getSubscriptions(id: Premifly.User["id"]) {
		return this.#http.get<Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}/subscriptions`,
		);
	}

	getAccounts(id: Premifly.User["id"]) {
		return this.#http.get<Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}/accounts`,
		);
	}

	getSubscribers(id: Premifly.User["id"]) {
		return this.#http.get<Premifly.User>(
			`${this.#environment.url.api}/premifly/user/${id}/subscribers`,
		);
	}

	delete(id: Premifly.User["id"]) {
		return this.#http.delete<unknown>(
			`${this.#environment.url.api}/premifly/user/${id}`,
		);
	}
}
