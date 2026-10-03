import type { Plug } from "shared/models";
import { DatePipe } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { differenceInDays } from "date-fns";


@Component({
	selector: "plug-tutorial-card",
	imports: [RouterLink, MatButtonModule, DatePipe],
	templateUrl: "./tutorial-card.ng.html",
	styleUrl: "./tutorial-card.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialCard {
	tutorial = input.required<Plug.Tutorial>();

	sessionDateDifference = computed(() =>
		this.tutorial()?.session
			? differenceInDays(new Date(), this.tutorial().session!.day)
			: null,
	);
}
