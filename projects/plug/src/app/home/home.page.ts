import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-home",
	imports: [MatButtonModule, RouterLink],
	templateUrl: "./home.page.ng.html",
	styleUrl: "./home.page.scss",
})
export class HomePage {}
