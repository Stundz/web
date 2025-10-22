import { Location } from "@angular/common";
import { HttpClient, HttpContext, httpResource } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, switchMap, tap, timer } from "rxjs";
import { HTTP_SKIP_ON_SERVER } from "../contexts";
import { ENVIRONMENT, Model } from "../types";
import { Cookie } from "./cookie";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({
	providedIn: "root",
})
export class User {
	protected readonly environment = inject(ENVIRONMENT);
	private _cookies = inject(Cookie);
	private _http = inject(HttpClient);
	private _location = inject(Location);

	user = httpResource<Model.User>(() => ({
		url: `https://api.${this.environment.domain}/user`,
	}));

	getUser() {
		this.user.reload();
	}

	signup(payload: Record<string, any> | FormData) {
		return this._http
			.post<void>(`https://api.${this.environment.domain}/auth/signup`, payload)
			.pipe(tap(() => this.user.reload()));
	}

	login(payload: Record<string, any> | FormData) {
		return this._http
			.post<void>(`https://api.${this.environment.domain}/login`, payload)
			.pipe(switchMap(() => timer(5).pipe(tap(() => this.user.reload()))));
	}

	logout() {
		this._http
			.get<void>(`https://api.${this.environment.domain}/auth/logout`)
			.pipe(
				tap(() => {
					this._cookies.clear();
					this._location.replaceState(
						`https://auth.${this.environment.domain}/login`,
					);
				}),
			);
	}
}
