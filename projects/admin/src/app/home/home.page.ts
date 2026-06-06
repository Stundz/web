import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "admin-home",
	imports: [MatButtonModule],
	templateUrl: "./home.page.ng.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./home.page.css",
})
export class HomePage {}
