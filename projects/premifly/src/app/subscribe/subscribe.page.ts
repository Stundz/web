import { httpResource } from "@angular/common/http";
import {
	Component,
	computed,
	input,
	linkedSignal,
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
	user = input.required<Model.User | undefined>();
	services = httpResource<Array<Model.Premifly.Service>>(
		() => `${environment.url.api}/premifly/services`,
		{
			defaultValue: [],
		},
	);

	formModel = linkedSignal(
		() => ({
			first_name: this.user()?.first_name || "",
			last_name: this.user()?.last_name ?? "",
			email: this.user()?.email ?? "",
			service_id: "",
			phone_type: "",
			phone: this.user()?.phone ?? "",
		}),
		{
			debugName: "Subscription Form",
		},
	);

	form = form(this.formModel, (root) => {
		required(root.first_name, {
			message: "This field is required",
			when: ({ stateOf }) => stateOf(root).touched(),
		});

		required(root.last_name, {
			message: "This field is required",
			when: ({ stateOf }) => stateOf(root).touched(),
		});

		required(root.email, {
			message: "This field is required",
			when: ({ stateOf }) => stateOf(root).touched(),
		});
		email(root.email, { message: "Invalid email" });

		required(root.service_id, { message: "Please select a service" });

		required(root.phone, {
			message: "Please select a service",
			when: ({ stateOf }) => stateOf(root).touched(),
		});
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
		this.services.value().find((s) => s.id === this.form.service_id().value()),
	);
}
