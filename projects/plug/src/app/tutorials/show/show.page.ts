import { CurrencyPipe, DatePipe } from "@angular/common";
import { httpResource } from "@angular/common/http";
import { Component, computed, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { environment } from "../../../environments/environment";
import { Model } from "shared";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-show",
	imports: [
		MatButtonModule,
		CurrencyPipe,
		MatProgressBarModule,
		RouterLink,
		DatePipe,
	],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	id = input.required({ alias: "tutorial" });
	tutorial = httpResource<Model.Tutorial>(() => ({
		url: `https://api.${environment.domain}/plug/tutorial/${this.id()}`,
		// context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
	}));
}
