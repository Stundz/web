import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import {
	BehaviorSubject,
	catchError,
	ignoreElements,
	of,
	shareReplay,
	switchMap,
	tap,
} from "rxjs";
import { ENVIRONMENT, type Model } from "../types";

@Injectable({
	providedIn: "root",
})
export class Auth {
	#http = inject(HttpClient);
	#environment = inject(ENVIRONMENT);
	#user = new BehaviorSubject<Model.User | null>(null);
	user$ = this.#user.asObservable();

	getUser() {
		return this.#http.get<Model.User>("https://api.stundz.localhost/user").pipe(
			catchError(() => of(null)),
			tap((user) => this.#user.next(user)),
			shareReplay(),
		);
	}

	signup(
		data: Pick<Model.User, "first_name" | "last_name" | "email"> &
			Record<"password" | "password_confirmation", string>,
	) {
		return this.#http
			.post<void>(`${this.#environment.url.api}/signup`, data)
			.pipe(
				switchMap(() =>
					this.getUser().pipe(
						catchError(() => of(null)),
						tap(this.#user.next),
						ignoreElements(),
					),
				),
			);
	}

	login(data: Pick<Model.User, "email"> & { password: string }) {
		return this.#http
			.post<void>(`${this.#environment.url.api}/login`, data)
			.pipe(switchMap(() => this.getUser().pipe(ignoreElements())));
	}
}
