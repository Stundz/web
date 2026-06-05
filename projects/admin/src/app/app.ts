import { Component, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	ResolveEnd,
	ResolveStart,
	RouteConfigLoadEnd,
	RouteConfigLoadStart,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet,
} from "@angular/router";
import { filter, map } from "rxjs";

@Component({
	selector: "admin-root",
	imports: [
		MatButtonModule,
		RouterLink,
		RouterLinkActive,
		RouterOutlet,
		MatProgressBarModule,
	],
	templateUrl: "./app.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./app.scss",
})
export class App {
	#router = inject(Router);
	protected readonly title = signal("admin");

	isLoading = toSignal(
		this.#router.events.pipe(
			filter(
				(event) =>
					event instanceof NavigationStart ||
					event instanceof RouteConfigLoadStart ||
					event instanceof ResolveStart ||
					event instanceof NavigationEnd ||
					event instanceof NavigationCancel ||
					event instanceof NavigationError ||
					event instanceof RouteConfigLoadEnd ||
					event instanceof ResolveEnd,
			),
			map(
				(event) =>
					event instanceof NavigationStart ||
					event instanceof RouteConfigLoadStart ||
					event instanceof ResolveStart,
			),
		),
		{ initialValue: false },
	);
}
