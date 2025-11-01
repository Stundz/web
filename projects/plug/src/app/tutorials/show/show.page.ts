import { CurrencyPipe, DatePipe } from "@angular/common";
import { httpResource } from "@angular/common/http";
import { Component, computed, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";
import { Model, User } from "shared";
import { environment } from "../../../environments/environment";
import { TutorialSessions } from "../../common/components/tutorial-sessions/tutorial-sessions";
import { addHours, addMinutes } from "date-fns";

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
	user = input.required<Model.User | undefined>();
	id = input.required({ alias: "tutorial" });
	tutorial = httpResource<Model.Plug.Tutorial>(() => ({
		url: `https://api.${environment.domain}/plug/tutorial/${this.id()}`,
		// context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
	}));

	endTime = computed(() => {
		return addMinutes(
			this.tutorial.value()?.session?.day || new Date(),
			this.tutorial.value()?.session?.duration || 0,
		);
	});
}
