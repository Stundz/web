import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { ENVIRONMENT, Model } from "shared";

@Component({
	selector: "auth-home",
	imports: [MatButtonModule, RouterLink],
	templateUrl: "./home.page.html",
	styleUrl: "./home.page.scss",
})
export class HomePage {
	user = input.required<Model.User | undefined>();
	environment = inject(ENVIRONMENT);
}
