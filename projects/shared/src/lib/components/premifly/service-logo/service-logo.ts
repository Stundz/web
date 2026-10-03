import type { Premifly } from "shared/models";
import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";


@Component({
	selector: "stundz-premifly-service-logo",
	imports: [MatTooltipModule],
	templateUrl: "./service-logo.ng.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./service-logo.css",
})
export class PremiflyServiceLogo {
	service = input.required<Premifly.Service>();
}
