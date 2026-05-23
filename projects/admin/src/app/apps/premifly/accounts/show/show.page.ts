import { DatePipe, DecimalPipe } from "@angular/common";
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
import { type Model } from "shared";

@Component({
	selector: "admin-show",
	imports: [
		DatePipe,
		DecimalPipe,
		RouterLink,
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
	#route = inject(ActivatedRoute);
	#snackBar = inject(MatSnackBar);

	// Bind resolved account data signal input
	account = input.required<Model.Premifly.Account>();

	// Track which field has been copied recently to show temporary checkmark
	copiedField = signal<"password" | "code" | null>(null);
	#copyTimeout: any = null;

	copyToClipboard(text: string, label: string, type: "password" | "code") {
		if (!text) return;

		navigator.clipboard.writeText(text).then(
			() => {
				this.#snackBar.open(`${label} copied to clipboard!`, "Close", {
					duration: 2000,
				});
				this.copiedField.set(type);

				if (this.#copyTimeout) {
					clearTimeout(this.#copyTimeout);
				}
				this.#copyTimeout = setTimeout(() => {
					this.copiedField.set(null);
				}, 2000);
			},
			() => {
				this.#snackBar.open(`Failed to copy ${label.toLowerCase()}.`, "Close", {
					duration: 2000,
				});
			}
		);
	}
}
