import { NgOptimizedImage } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-home",
	imports: [MatButtonModule, RouterLink, NgOptimizedImage, MatCardModule],
	templateUrl: "./home.page.ng.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./home.page.css",
})
export class HomePage {
	environment = environment;
}
