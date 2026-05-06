import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Model } from "shared";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class Session {
	#http = inject(HttpClient);

	getSession(id: string) {
		return this.#http.get<Model.Plug.Session>(
			`${environment.url.api}/plug/session/${id}`,
		);
	}
}
