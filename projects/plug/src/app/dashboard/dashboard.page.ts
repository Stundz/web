import { httpResource } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-dashboard",
	imports: [MatButtonModule, RouterLink],
	templateUrl: "./dashboard.page.ng.html",
	styleUrl: "./dashboard.page.scss",
})
export class DashboardPage {
	sessions = httpResource(
		() => `https://api.${environment.domain}/plug/tutorials/sessions`,
	);
	pastQuestions = httpResource<{ data: Array<any> }>(
		() => ({
			url: `https://api.${environment.domain}/plug/past-questions`,
			params: {
				limit: 3,
			},
		}),
		{
			defaultValue: {
				data: [],
			},
		},
	);
}
