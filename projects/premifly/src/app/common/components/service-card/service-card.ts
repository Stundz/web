import type { Premifly } from "shared/models";
import { CurrencyPipe } from "@angular/common";
import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";


@Component({
	selector: "premifly-service-card",
	imports: [CurrencyPipe, MatButtonModule, RouterLink],
	templateUrl: "./service-card.ng.html",
	styleUrl: "./service-card.css",
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {
		"[class.service-card]": "true",
	},
})
export class ServiceCard {
	service = input.required<Premifly.Service>();
}
