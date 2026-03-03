import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";
import { addMinutes } from "date-fns";
import type { Model } from "shared";
import { BookingForm } from "../../common/components/booking-form/booking-form";
import { TutorialSessions } from "../../common/components/tutorial-sessions/tutorial-sessions";

@Component({
	selector: "plug-show-tutorial",
	imports: [
		MatButtonModule,
		CurrencyPipe,
		MatProgressBarModule,
		RouterLink,
		DatePipe,
		TutorialSessions,
	],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	tutorial = input.required<Model.Plug.Tutorial>();
	user = input.required<Model.User | undefined>();

	#dialog = inject(MatDialog);

	endTime = computed(() => {
		return addMinutes(
			this.tutorial()?.session?.day || new Date(),
			this.tutorial()?.session?.duration || 0,
		);
	});

	book() {
		this.#dialog.open(BookingForm);
	}
}
