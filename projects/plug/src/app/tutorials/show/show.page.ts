import { CurrencyPipe } from "@angular/common";
import { HttpContext, httpResource } from "@angular/common/http";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { environment } from "../../../environments/environment";
import { HTTP_SKIP_ON_SERVER, Model } from "shared";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-show",
	imports: [MatButtonModule, CurrencyPipe, MatProgressBarModule, RouterLink],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	id = input.required({ alias: "tutorial" });
	tutorial = httpResource<Model.Tutorial>(() => ({
		url: `${environment.url.api}/plug/tutorial/${this.id()}`,
		context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
	}));
}
