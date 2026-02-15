import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@Component({
	selector: "plug-about",
	imports: [RouterLink, MatButtonModule, MatCardModule],
	templateUrl: "./about.page.ng.html",
	styleUrl: "./about.page.scss",
})
export class AboutPage {}
