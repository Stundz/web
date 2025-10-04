import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { signalStore, withMethods } from "@ngrx/signals";
import { catchError, delay, EMPTY, retry, switchMap, tap } from "rxjs";
import { withAuthStore } from "shared";

export const UserStore = signalStore(
	{ providedIn: "root" },
	withAuthStore(),
	withMethods(
		(store, _router = inject(Router), _destroyRef = inject(DestroyRef)) => ({
			login: (params: Record<string, any> | FormData) =>
				store._http$
					.post<void>(`${store._environment.url.api}/auth/login`, params)
					.pipe(switchMap(() => store.getUser().pipe(catchError(() => EMPTY)))),

			logout: () =>
				store._logout().pipe(
					takeUntilDestroyed(_destroyRef),
					tap(() => _router.navigate(["/login"])),
				),
		}),
	),
);
