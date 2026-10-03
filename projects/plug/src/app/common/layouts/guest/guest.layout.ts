import type { User as UserModel } from "shared/models";
import { Component, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
	ActivatedRoute,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterLinkWithHref,
	RouterOutlet,
} from "@angular/router";
import { ENVIRONMENT, User } from "shared";

@Component({
	selector: "app-guest",
	imports: [
		RouterLink,
		RouterLinkActive,
		RouterOutlet,
		MatButtonModule,
		RouterLinkWithHref,
	],
	templateUrl: "./guest.layout.ng.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./guest.layout.scss",
})
export class GuestLayout {
	user = input.required<UserModel | undefined>();
	protected userService = inject(User);
	private _router = inject(Router);
	protected _route = inject(ActivatedRoute);

	protected readonly environment = inject(ENVIRONMENT);
}
