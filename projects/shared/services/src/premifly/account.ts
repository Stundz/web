import { HttpClient } from "@angular/common/http";
import { inject, Service, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { switchMap } from "rxjs";
import type { Premifly } from "shared/models";
import { ENVIRONMENT, type Paginated } from "shared/types";

@Service()
export class PremiflyAccount<T = Paginated<Premifly.Account>> {
  #environment = inject(ENVIRONMENT);
  #http = inject(HttpClient);
  params = signal<Record<string, string | boolean | number>>({});
  #params$ = toObservable(this.params);

	accounts$ = this.#params$.pipe(
		switchMap((params) =>
			this.#http.get<T>(`${this.#environment.url.api}/premifly/accounts`, {
				params,
			}),
		),
	);

  getAccount(id: Premifly.Account["id"]) {
    return this.#http.get<Premifly.Account>(
      `${this.#environment.url.api}/premifly/account/${id}`,
    );
  }

  getServices(id: Premifly.Account["id"]) {
    return this.#http.get<Paginated<Premifly.Service>>(
      `${this.#environment.url.api}/premifly/account/${id}/services`,
    );
  }

  create(body: Pick<Premifly.Account, "email">) {
    return this.#http.post<Premifly.Account>(
      `${this.#environment.url.api}/premifly/account`,
      body,
    );
  }

  update(
    id: Premifly.Account["id"],
    payload: Partial<Pick<Premifly.Account, "email">>,
  ) {
    return this.#http.patch<Premifly.Account>(
      `${this.#environment.url.api}/premifly/account/${id}`,
      payload,
    );
  }

  delete(id: Premifly.Account["id"]) {
    return this.#http.delete<unknown>(
      `${this.#environment.url.api}/premifly/account/${id}`,
    );
  }

  attachService(
    accountId: Premifly.Account["id"],
    payload: {
      service_id: Premifly.Service["id"];
      password: string;
      code: string;
      expires_at: string;
    },
  ) {
    return this.#http.post<unknown>(
      `${this.#environment.url.api}/premifly/account/${accountId}/service`,
      payload,
    );
  }
}
