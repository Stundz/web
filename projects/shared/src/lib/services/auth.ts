import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, catchError, of, shareReplay, tap } from "rxjs";
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
}
