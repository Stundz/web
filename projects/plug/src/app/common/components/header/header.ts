import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-header",
	imports: [RouterLink, MatButtonModule],
	templateUrl: "./header.ng.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./header.scss",
})
export class Header {}
