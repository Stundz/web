import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
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
		return this.#http
			.get<Model.User>(`api.${this.#environment.domain}/user`)
			.pipe(tap(this.#user.next));
	}
}
