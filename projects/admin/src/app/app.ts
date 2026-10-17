import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
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
        MatSidenavModule, MatToolbarModule, MatListModule,
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
  protected readonly drawerOpen = signal(false);
  protected readonly compact = toSignal(inject(BreakpointObserver).observe('(max-width: 900px)').pipe(map(result => result.matches)), { initialValue: false });
  protected readonly links = [
    { label: 'Overview', route: '/', icon: 'icon-[material-symbols--dashboard-outline]' },
    { label: 'Applications', route: '/apps', icon: 'icon-[material-symbols--apps]' },
  ];

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
