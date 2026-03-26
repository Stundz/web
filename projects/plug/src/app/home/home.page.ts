import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-home",
	imports: [MatButtonModule, RouterLink, NgOptimizedImage],
	templateUrl: "./home.page.ng.html",
	styleUrl: "./home.page.css",
})
export class HomePage {
	environment = environment;
}
