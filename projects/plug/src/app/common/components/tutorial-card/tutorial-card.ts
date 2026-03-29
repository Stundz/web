import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import type { Model } from "shared";

@Component({
	selector: "plug-tutorial-card",
	imports: [RouterLink, MatButtonModule],
	templateUrl: "./tutorial-card.ng.html",
	styleUrl: "./tutorial-card.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialCard {
	tutorial = input.required<Model.Plug.Tutorial>();
}
