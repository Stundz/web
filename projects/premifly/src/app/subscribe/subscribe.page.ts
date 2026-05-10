import { isPlatformBrowser, NgOptimizedImage } from "@angular/common";
import { HttpClient, httpResource } from "@angular/common/http";
import {
	Component,
	computed,
	effect,
	inject,
	input,
	linkedSignal,
	PLATFORM_ID,
	viewChild,
} from "@angular/core";
import { FormField, FormRoot, form, required } from "@angular/forms/signals";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { type MatStepper, MatStepperModule } from "@angular/material/stepper";
import { firstValueFrom, tap } from "rxjs";
import type { Model } from "shared";
import { environment } from "../../environments/environment";
import { SubscriptionInstructions } from "../common/components/subscription-instructions/subscription-instructions";

@Component({
	selector: "premifly-subscribe",
	imports: [
		FormRoot,
		FormField,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatStepperModule,
		MatCardModule,
		NgOptimizedImage,

		SubscriptionInstructions,
	],
	templateUrl: "./subscribe.page.html",
	styleUrl: "./subscribe.page.css",
})
export class SubscribePage {
	user = input.required<Model.User | null>();
	#snackBar = inject(MatSnackBar);
	services = httpResource<Array<Model.Premifly.Service>>(
		() => `${environment.url.api}/premifly/services`,
		{
			defaultValue: [],
		},
	);
	#http = inject(HttpClient);
	stepper = viewChild.required<MatStepper>("stepper");

	#platformId = inject(PLATFORM_ID);

	loginUrl!: string;
	signupUrl!: string;

	phones = [
		"Iphone 4/4S",
		"Iphone 5/5S/5E",
		"Iphone 6/6S/6+",
		"Iphone 7/7+7S/7S+",
		"Iphone 8/8+8S/8S+",
		"Iphone X/XR/XS/Xs MAX",
		"Iphone 11/11 Pro/11 Pro MAX",
		"Iphone 12/12 Pro/12 Pro MAX",
		"Iphone 13/13 Pro/13 Pro MAX",
		"Iphone 14/14+/14 Pro/14 Pro MAX",
		"Iphone 15/15+/15 Pro/15 Pro MAX",
		"Iphone 16/16+/16 Pro/16 Pro MAX",
		"Iphone 17/17 Air",
		"Samsung S21/S21+/S21 Ultra",
		"Samsung S22/S22+/S22 Ultra",
		"Samsung S23/S23+/S23 Ultra",
		"Samsung S24/S24+/S24 Ultra",
		"Samsung S25/S25+/S25 Ultra",
		"Samsung Z Fold 5/6",
		"Samsung Z Flip 5/6",
		"Lg TV",
		"Hisense TV",
		"Samsung TV",
		"Other",
	];

	formModel = linkedSignal(
		() => ({
			service_id: "",
			account_id: "",
			device_type: "",
			phone: this.user()?.phone || "",
		}),
		{
			debugName: "Subscription Form Model",
		},
	);

	form = form(
		this.formModel,
		(root) => {
			required(root.service_id, { message: "Please select a service" });

			required(root.phone, {
				message: "Please Enter your phone number",
			});
		},
		{
			name: "Subscription Form",
			submission: {
				action: async (tree, detail) => {
					return firstValueFrom(
						this.#http
							.post<void>(
								`${environment.url.api}/premifly/subscription`,
								tree().value(),
							)
							.pipe(
								tap(() => {
									this.stepper().next();
									this.form().reset({
										service_id: "",
										account_id: "",
										device_type: "",
										phone: this.user()?.phone || "",
									});
								}),
							),
					);
				},
			},
		},
	);

	accounts = httpResource<Array<Model.Premifly.Account>>(
		() =>
			this.form.service_id().value()
				? {
						url: `${environment.url.api}/premifly/service/${this.form.service_id().value()}/accounts`,
					}
				: undefined,
		{
			defaultValue: [],
		},
	);

	account = linkedSignal(() =>
		this.accounts
			.value()
			.sort((a, b) => a.subscriptions_count - b.subscriptions_count)
			.at(0),
	);

	service = computed(() =>
		this.services.value().find((s) => s.id === this.form().value().service_id),
	);

	accountEffect = effect(() => {
		if (this.account()) {
			this.form.account_id().value.set(this.account()!.id);
		}
	});

	ngOnInit() {
		if (isPlatformBrowser(this.#platformId)) {
			const callback = `?callback=${window.location.href}`;
			this.loginUrl = `${environment.url.auth}/login${callback}`;
			this.signupUrl = `${environment.url.auth}/signup${callback}`;
		}
	}
}
