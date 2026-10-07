import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import type { Plug } from "shared/models";

import { environment } from "../../../environments/environment";

@Service()
export class Session {
  #http = inject(HttpClient);

  getSession(id: string) {
    return this.#http.get<Plug.Session>(
      `${environment.url.api}/plug/session/${id}`,
    );
  }
}
