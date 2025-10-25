import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
	ActivatedRoute,
	Router,
	RouterLink,
	RouterLinkWithHref,
	RouterOutlet,
} from "@angular/router";
import { ENVIRONMENT, Model, User } from "shared";

@Component({
	selector: "app-guest",
	imports: [RouterLink, RouterOutlet, MatButtonModule, RouterLinkWithHref],
	templateUrl: "./guest.layout.ng.html",
	styleUrl: "./guest.layout.scss",
})
export class GuestLayout {
	user = input.required<Model.User>();
	protected userService = inject(User);
	private _router = inject(Router);
	protected _route = inject(ActivatedRoute);

	protected readonly environment = inject(ENVIRONMENT);
}
