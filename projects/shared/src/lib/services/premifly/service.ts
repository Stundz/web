import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Subject, shareReplay, switchMap, tap } from "rxjs";
import { ENVIRONMENT, type Model, type Paginated } from "../../types";

@Injectable({
	providedIn: "root",
})
export class PremiflyService<T = Paginated<Model.Premifly.Service>> {
	#environment = inject(ENVIRONMENT);
	#http = inject(HttpClient);
	params = signal<Record<string, string | boolean | number>>({});
	#params$ = toObservable(this.params);

	services$ = this.#params$.pipe(
		switchMap((params) =>
			this.#http.get<T>(`${this.#environment.url.api}/premifly/services`, {
				params,
			}),
		),
		shareReplay(),
	);

	#serviceSubject = new Subject<Model.Premifly.Service>();
	service$ = this.#serviceSubject.pipe(shareReplay());

	getService(id: Model.Premifly.Service["id"]) {
		return this.#http.get<Model.Premifly.Service>(
			`${this.#environment.url.api}/premifly/service/${id}`,
		).pipe(tap((service) => this.#serviceSubject.next(service)));
	}

	create(body: Pick<Model.Premifly.Service, "name" | "enabled" | "price" | "limit">) {
		return this.#http.post<Model.Premifly.Service>(
			`${this.#environment.url.api}/premifly/service`,
			body,
		);
	}

	update(
		slug: Model.Premifly.Service["slug"],
		payload: Partial<
			Pick<Model.Premifly.Service, "name" | "enabled" | "price" | "limit">
		>,
	) {
		return this.#http.patch<Model.Premifly.Service>(
			`${this.#environment.url.api}/premifly/service/${slug}`,
			payload,
		);
	}

	getSubscriptions(id: Model.Premifly.Service["id"]) {
		return this.#http.get<Paginated<Model.Premifly.Service>>(
			`${this.#environment.url.api}/premifly/service/${id}/subscriptions`,
		);
	}

	getAccounts(id: Model.Premifly.Service["id"]) {
		return this.#http.get<Model.Premifly.Service>(
			`${this.#environment.url.api}/premifly/service/${id}/accounts`,
		);
	}

	getSubscribers(
		id: Model.Premifly.Service["id"],
		params: Record<string, string | number | boolean> = {},
	) {
		return this.#http.get<
			Paginated<
				Model.User & { premifly_accounts: Array<Model.Premifly.Account> }
			>
		>(`${this.#environment.url.api}/premifly/service/${id}/subscribers`, {
			params,
		});
	}

	delete(id: Model.Premifly.Service["id"]) {
		return this.#http.delete<unknown>(
			`${this.#environment.url.api}/premifly/service/${id}`,
		);
	}
}
