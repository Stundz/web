import { DatePipe } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { differenceInDays } from "date-fns";
import type { Model } from "shared";

@Component({
	selector: "plug-show-session",
	imports: [DatePipe, RouterLink, MatButtonModule],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	session = input.required<Model.Plug.Session>();

	bookable = computed(
		() => differenceInDays(this.session().day, new Date()) > 0,
	);
}
