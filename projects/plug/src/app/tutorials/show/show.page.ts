import { CurrencyPipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-show",
	imports: [MatButtonModule, CurrencyPipe],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	id = input.required({ alias: "tutorial" });
	// fetch tutorial with hhtpResource
}
