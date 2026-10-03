import type { Premifly } from "shared/models";
import { DatePipe, NgPlural, NgPluralCase } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, RouterLink } from "@angular/router";


@Component({
	selector: "admin-show",
	imports: [
		DatePipe,
		RouterLink,
		NgPlural,
		NgPluralCase,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatCardModule,
		MatSnackBarModule,
	],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPage {
	// Bind resolved account data signal input
	account = input.required<Premifly.Account>();

	// Track which field has been copied recently to show temporary checkmark
	copiedField = signal<"password" | "code" | null>(null);
}
