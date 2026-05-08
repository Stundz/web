import { isPlatformBrowser } from "@angular/common";
import { httpResource } from "@angular/common/http";
import {
	Component,
	computed,
	inject,
	input,
	linkedSignal,
	PLATFORM_ID,
	signal,
} from "@angular/core";
import {
	email,
	FormField,
	FormRoot,
	form,
	required,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import type { Model } from "shared";
import { environment } from "../../environments/environment";

@Component({
	selector: "premifly-subscribe",
	imports: [
		FormRoot,
		FormField,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatChipsModule,
	],
	templateUrl: "./subscribe.page.html",
	styleUrl: "./subscribe.page.css",
})
export class SubscribePage {
	user = input.required<Model.User | null>();
	services = httpResource<Array<Model.Premifly.Service>>(
		() => `${environment.url.api}/premifly/services`,
		{
			defaultValue: [],
		},
	);

	#platformId = inject(PLATFORM_ID);

	loginUrl!: string;
	signupUrl!: string;

	formModel = linkedSignal(
		() => ({
			user_id: this.user()?.id,
			service_id: "",
			phone_type: "",
		}),
		{
			debugName: "Subscription Form",
		},
	);

	form = form(this.formModel, (root) => {
		required(root.service_id, { message: "Please select a service" });
	});

	accounts = httpResource<Array<Model.Premifly.Account>>(
		() =>
			this.formModel().service_id
				? {
						url: `${environment.url.api}/premifly/service/${this.formModel().service_id}/accounts`,
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

	ngOnInit() {
		if (isPlatformBrowser(this.#platformId)) {
			const callback = `?callback=${window.location.href}`;
			this.loginUrl = `${environment.url.auth}/login${callback}`;
			this.signupUrl = `${environment.url.auth}/signup${callback}`;
		}
	}
}
