import { Component, input } from "@angular/core";
import type { Model } from "shared";

@Component({
	selector: "premifly-subscription-instructions",
	imports: [],
	templateUrl: "./subscription-instructions.ng.html",
	styleUrl: "./subscription-instructions.css",
})
export class SubscriptionInstructions {
	service = input.required<Model.Premifly.Service>();
	account = input.required<Model.Premifly.Account>();
}
