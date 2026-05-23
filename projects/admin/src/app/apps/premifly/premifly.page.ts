import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterLink } from "@angular/router";
import { map } from "rxjs";

@Component({
	selector: "admin-premifly",
	imports: [
		RouterLink,
		MatGridListModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
	],
	templateUrl: "./premifly.page.ng.html",
	styleUrl: "./premifly.page.css",
})
export class PremiflyPage {
	private breakpointObserver = inject(BreakpointObserver);

	/** Based on the screen size, switch from standard to one column per row */
	cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
		map(({ matches }) => {
			if (matches) {
				return [
					{ title: "Services", cols: 1, rows: 1 },
					{ title: "Subscriptions", cols: 1, rows: 1 },
					{ title: "Users", cols: 1, rows: 1 },
					{ title: "Accounts", cols: 1, rows: 1 },
				];
			}

			return [
				{ title: "Services", cols: 2, rows: 1 },
				{ title: "Subscriptions", cols: 1, rows: 1 },
				{ title: "Users", cols: 1, rows: 2 },
				{ title: "Accounts", cols: 1, rows: 1 },
			];
		}),
	);
}
