import { httpResource } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import type { Model } from "shared";
import { environment } from "../../environments/environment";
import { ServiceCard } from "../common/components/service-card/service-card";

@Component({
	selector: "premifly-home",
	imports: [ServiceCard, MatButtonModule],
	templateUrl: "./home.page.ng.html",
	styleUrl: "./home.page.css",
})
export class HomePage {
	services = httpResource<Array<Model.Premifly.Service>>(
		() => `${environment.url.api}/premifly/services`,
		{
			defaultValue: [],
		},
	);
}
