import { CurrencyPipe, DatePipe } from "@angular/common";
import {
	Component,
	computed,
	inject,
	input,
	linkedSignal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";
import { addMinutes } from "date-fns";
import { Model } from "shared";
import { TutorialSessions } from "../../common/components/tutorial-sessions/tutorial-sessions";
import { MatDialog } from "@angular/material/dialog";
import { BookingForm } from "../../common/components/booking-form/booking-form";
import { Meta, Title } from "@angular/platform-browser";

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
	#meta = inject(Meta);
	#title = inject(Title);

	endTime = computed(() => {
		return addMinutes(
			this.tutorial()?.session?.day || new Date(),
			this.tutorial()?.session?.duration || 0,
		);
	});

	ngOnInit() {
		console.log(this.tutorial());
		this.#title.setTitle(this.tutorial().name);
		this.#meta.updateTag({
			id: "keywords",
			name: "keywords",
			content: `plug, tutorials, tutorial, ${this.tutorial().name.replace(/ /g, ", ")}, ${this.tutorial().course?.title.replace(/ /g, ", ")}`,
		});
		this.#meta.updateTag({
			id: "description",
			name: "description",
			content: this.tutorial().description,
		});
		this.#meta.updateTag({
			id: "og:description",
			property: "og:description",
			content: this.tutorial().description,
		});
	}

	book() {
		this.#dialog.open(BookingForm);
	}
}
