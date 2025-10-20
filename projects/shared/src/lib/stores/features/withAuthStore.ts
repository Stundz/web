import { HttpClient, HttpContext } from "@angular/common/http";
import { inject } from "@angular/core";
import {
	patchState,
	signalStoreFeature,
	withMethods,
	withProps,
	withState,
} from "@ngrx/signals";
import { tap } from "rxjs";
import { ENVIRONMENT, Model } from "../../types";
import { Cookie } from "../../services";
import { HTTP_SKIP_ON_SERVER } from "../../contexts";

export interface AuthStoreState {
	user: Model.User | null;
}

export function withAuthStore() {
	return signalStoreFeature(
		withState<AuthStoreState>({ user: null }),
		withProps((_store) => ({
			_http$: inject(HttpClient),
			_environment: inject(ENVIRONMENT),
			_cookies: inject(Cookie),
		})),
		withMethods((store) => ({
			getUser: () =>
				store._http$
					.get<Model.User>(`https://api.${store._environment.domain}/user`, {
						context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
					})
					.pipe(tap((user) => patchState(store, { user }))),

			_logout: () =>
				store._http$
					.get<void>(`https://api.${store._environment.domain}/auth/logout`)
					.pipe(tap(() => store._cookies.clear())),
		})),
	);
}
