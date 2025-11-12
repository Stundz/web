import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
	BehaviorSubject,
	map,
	shareReplay,
	startWith,
	Subject,
	switchMap,
	tap,
} from "rxjs";
import { ENVIRONMENT, Model } from "../types";
import { Cookie } from "./cookie";

@Injectable({
	providedIn: "root",
})
export class User {
	protected readonly environment = inject(ENVIRONMENT);
	private _cookies = inject(Cookie);
	private _http = inject(HttpClient);

	private _user = new BehaviorSubject<void>(undefined);
	// private _user$ = this._user.asObservable();

	user$ = this._user.asObservable().pipe(
		switchMap(() =>
			this._http
				.get<Model.User>(`https://api.${this.environment.domain}/user`)
				.pipe(),
		),
		shareReplay(),
	);

	fetchUser() {
		this._user.next();
	}

	signup(payload: Record<string, any> | FormData) {
		return this._http
			.post<void>(`https://api.${this.environment.domain}/signup`, payload)
			.pipe(
				switchMap(() =>
					this.user$.pipe(
						map(() => {
							return;
						}),
					),
				),
			);
	}

	login(payload: Record<string, any> | FormData) {
		return this._http
			.post<void>(`https://api.${this.environment.domain}/login`, payload)
			.pipe(
				switchMap(() =>
					this.user$.pipe(
						map(() => {
							return;
						}),
					),
				),
			);
	}

	logout() {
		return this._http
			.post<void>(`https://api.${this.environment.domain}/logout`, {})
			.pipe(
				tap(() => {
					this._cookies.clear();
					window.location.replace("/");
				}),
			);
	}
}
