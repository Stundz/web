import { NgOptimizedImage } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import type { Model } from "shared";

@Component({
	selector: "premifly-subscription-instructions",
	imports: [NgOptimizedImage],
	templateUrl: "./subscription-instructions.ng.html",
	styleUrl: "./subscription-instructions.css",
})
export class SubscriptionInstructions {
	service = input.required<Model.Premifly.Service>();
	account = input.required<Model.Premifly.Account>();

	#user = inject(ActivatedRoute).snapshot.data["user"] as Model.User;

	message = computed(() =>
		encodeURIComponent(`Premifly subscription for *${this.service().name}*\n\nI am *${this.#user.first_name} ${this.#user.last_name} (${this.#user.email})*\n\nlooking to complete my subscription with email *${this.account().email}*.
    `),
	);
}
