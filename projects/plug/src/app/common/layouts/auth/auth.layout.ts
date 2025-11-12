import { Component, DestroyRef, inject, input } from "@angular/core";
import {
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	ResolveEnd,
	ResolveStart,
	Router,
	RouterLink,
	RouterOutlet,
} from "@angular/router";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatBadgeModule } from "@angular/material/badge";
import { Model, User } from "shared";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { filter, map, of, switchMap, timer } from "rxjs";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "plug-auth-layout",
	imports: [
		RouterLink,
		RouterOutlet,
		MatButtonModule,
		MatRippleModule,
		MatMenuModule,
		MatToolbarModule,
		MatSidenavModule,
		MatBadgeModule,
		MatProgressBarModule,
	],
	templateUrl: "./auth.layout.ng.html",
	styleUrl: "./auth.layout.scss",
})
export class AuthLayout {
	user = input.required<Model.User | undefined>();

	private _userService = inject(User);
	private _router = inject(Router);
	private _destroyRef = inject(DestroyRef);

	loading = toSignal(
		this._router.events.pipe(
			filter(
				(event) =>
					event instanceof NavigationStart ||
					event instanceof NavigationEnd ||
					event instanceof NavigationError ||
					event instanceof NavigationCancel ||
					event instanceof ResolveStart ||
					event instanceof ResolveEnd,
			),
			switchMap((event) => {
				if (event instanceof NavigationStart || event instanceof ResolveStart) {
					return of(true);
				}

				return timer(300).pipe(map(() => false));
			}),
		),
	);

	logout() {
		return this._userService
			.logout()
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe();
	}
}
