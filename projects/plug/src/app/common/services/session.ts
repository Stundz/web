import type { Plug } from "shared/models";
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class Session {
	#http = inject(HttpClient);

	getSession(id: string) {
		return this.#http.get<Plug.Session>(
			`${environment.url.api}/plug/session/${id}`,
		);
	}
}
