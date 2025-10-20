import { JsonPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { filter, map, switchMap } from "rxjs";

@Component({
	selector: "auth-authorize",
	imports: [MatCardModule, JsonPipe],
	templateUrl: "./authorize.page.html",
	styleUrl: "./authorize.page.scss",
})
export class AuthorizePage {
	protected _route = inject(ActivatedRoute);
	params = toSignal(this._route.queryParams.pipe());
}
