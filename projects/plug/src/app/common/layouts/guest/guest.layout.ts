import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
	Router,
	RouterLink,
	RouterLinkWithHref,
	RouterOutlet,
} from "@angular/router";
import { ENVIRONMENT, User } from "shared";

@Component({
	selector: "app-guest",
	imports: [RouterLink, RouterOutlet, MatButtonModule, RouterLinkWithHref],
	templateUrl: "./guest.layout.ng.html",
	styleUrl: "./guest.layout.scss",
})
export class GuestLayout {
	protected userService = inject(User);
	private _router = inject(Router);
	protected readonly environment = inject(ENVIRONMENT);
}
