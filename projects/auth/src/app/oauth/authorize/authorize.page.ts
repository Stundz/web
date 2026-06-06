import { JsonPipe } from "@angular/common";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";

@Component({
	selector: "auth-authorize",
	imports: [MatCardModule, JsonPipe],
	templateUrl: "./authorize.page.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./authorize.page.scss",
})
export class AuthorizePage {
	protected _route = inject(ActivatedRoute);
	params = toSignal(this._route.queryParams.pipe());
}
