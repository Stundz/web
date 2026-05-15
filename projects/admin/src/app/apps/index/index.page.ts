import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";

@Component({
	selector: "admin-index",
	imports: [RouterLink, MatCardModule],
	templateUrl: "./index.page.ng.html",
	styleUrl: "./index.page.css",
})
export class IndexPage {
	apps = [
		{
			name: "Plug",
			icon: "icon-[material-symbols--school-outline]",
			url: "/app/plug",
			description: "",
		},
		{
			name: "premifly",
			icon: "",
			url: "/app/premifly",
			description: "",
		},
	];
}
