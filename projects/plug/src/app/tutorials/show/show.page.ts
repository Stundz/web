import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";
import { addMinutes } from "date-fns";
import { Model } from "shared";
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

	endTime = computed(() => {
		return addMinutes(
			this.tutorial()?.session?.day || new Date(),
			this.tutorial()?.session?.duration || 0,
		);
	});
}
