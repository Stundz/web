import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { Model } from "shared";

@Component({
	selector: "plug-show",
	imports: [MatTabsModule, MatButtonModule],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	tutor = input.required<Model.Plug.Tutor>();
}
