import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButton } from "@angular/material/button";

@Component({
	selector: "plug-about",
	imports: [RouterLink, MatButton],
	templateUrl: "./about.page.ng.html",
	styleUrl: "./about.page.scss",
})
export class AboutPage {}
