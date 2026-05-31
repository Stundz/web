import { isPlatformBrowser, NgOptimizedImage } from "@angular/common";
import { HttpClient, httpResource } from "@angular/common/http";
import {
	Component,
	effect,
	inject,
	input,
	linkedSignal,
	PLATFORM_ID,
	signal,
	viewChild,
} from "@angular/core";
import {
	FormField,
	FormRoot,
	form,
	min,
	minLength,
	required,
} from "@angular/forms/signals";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { type MatStepper, MatStepperModule } from "@angular/material/stepper";
import { firstValueFrom, tap } from "rxjs";
import { type Model, PremiflyServiceLogo } from "shared";
import { environment } from "../../environments/environment";
import { SubscriptionPayment } from "./common/components/subscription-payment/subscription-payment";

@Component({
	selector: "premifly-subscribe",
	imports: [
		FormRoot,
		FormField,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatFormFieldModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatStepperModule,
		MatSelectModule,
		MatCardModule,
		NgOptimizedImage,
		PremiflyServiceLogo,
	],
	templateUrl: "./subscribe.page.html",
	styleUrl: "./subscribe.page.css",
})
export class SubscribePage {
	user = input.required<Model.User | null>();

	#snackBar = inject(MatSnackBar);
	#dialog = inject(MatDialog);

	services = httpResource<Array<Model.Premifly.Service>>(
		() => ({
			url: `${environment.url.api}/premifly/services`,
			params: {
				status: "active",
			},
		}),
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
			device_type: "",
			duration: 1,
			phone: this.user()?.phone || "",
		}),
		{
			debugName: "Subscription Form Model",
		},
	);

	form = form(
		this.formModel,
		(root) => {
			required(root.service_id, {
				message: "Please select a service",
				when: ({ stateOf }) => stateOf(root).touched(),
			});

			required(root.device_type, {
				message: "Please select your device",
				when: () => {
					return ["prime-video", "netflix"].includes(
						String(this.service()?.slug),
					);
				},
			});

			min(root.duration, 1);

			required(root.phone, {
				message: "Please Enter your phone number",
				when: ({ stateOf }) => stateOf(root).touched(),
			});
			minLength(root.phone, 8, {
				message: "The minimum length of your phone number should be 8 digits",
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
									this.#snackBar.open(
										`You successfully subscribed to ${this.service()?.name}`,
										"",
										{
											duration: 5000,
											horizontalPosition: "end",
											verticalPosition: "top",
										},
									);
									this.form().reset({
										service_id: "",
										duration: 1,
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

	service = signal<Model.Premifly.Service | undefined>(undefined);

	serviceEffect = effect(() => {
		if (this.form.service_id().value()) {
			this.service.set(
				this.services
					.value()
					.find((s) => s.id === this.form.service_id().value()),
			);
		}
	});

	ngOnInit() {
		if (isPlatformBrowser(this.#platformId)) {
			const callback = `?callback=${window.location.href}`;
			this.loginUrl = `${environment.url.auth}/login${callback}`;
			this.signupUrl = `${environment.url.auth}/signup${callback}`;
		}
	}

	openPaymentModal() {
		const dialogRef = this.#dialog.open(SubscriptionPayment, {
			data: {
				service: this.service()!,
				duration: this.form.duration().value(),
				phone: this.form.phone().value(),
				device_type: this.form.device_type().value(),
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.#snackBar.open(
					`A confirmation email with instructions will be sent to ${this.user()?.email} after payment has been confirmed`,
					"close",
				);

				this.form().reset({
					service_id: "",
					duration: 1,
					device_type: "",
					phone: this.user()?.phone || "",
				});
			}
		});
	}
}
