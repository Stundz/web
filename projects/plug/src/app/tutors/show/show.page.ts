import { Component, input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { Model } from "shared";

@Component({
	selector: "plug-show",
	imports: [MatTabsModule],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	tutor = input.required<Model.Plug.Tutor>();
}
