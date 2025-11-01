import { Component, DestroyRef, inject, input } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatBadgeModule } from "@angular/material/badge";
import { Model, User } from "shared";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AsyncPipe } from "@angular/common";

@Component({
	selector: "plug-auth-layout",
	imports: [
		RouterLink,
		RouterOutlet,
		MatRippleModule,
		MatMenuModule,
		MatToolbarModule,
		MatSidenavModule,
		MatBadgeModule,
		AsyncPipe,
	],
	templateUrl: "./auth.layout.ng.html",
	styleUrl: "./auth.layout.scss",
})
export class AuthLayout {
	user = input.required<Model.User | undefined>();

	private _userService = inject(User);
	private _destroyRef = inject(DestroyRef);

	logout() {
		return this._userService
			.logout()
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe();
	}
}
