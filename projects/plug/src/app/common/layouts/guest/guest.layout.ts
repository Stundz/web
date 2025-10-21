import { HttpParams } from "@angular/common/http";
import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import {
	Router,
	RouterLink,
	RouterLinkWithHref,
	RouterOutlet,
} from "@angular/router";
import { ENVIRONMENT } from "shared";

@Component({
	selector: "app-guest",
	imports: [RouterLink, RouterOutlet, MatButtonModule, RouterLinkWithHref],
	templateUrl: "./guest.layout.ng.html",
	styleUrl: "./guest.layout.scss",
})
export class GuestLayout {
	private _router = inject(Router);
	protected readonly environment = inject(ENVIRONMENT);
}
