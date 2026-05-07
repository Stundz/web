import { httpResource } from "@angular/common/http";
import { Component, signal } from "@angular/core";
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
	services = httpResource<Array<Model.Premifly.Service>>(
		() => `${environment.url.api}/premifly/services`,
		{
			defaultValue: [],
		},
	);

	formModel = signal({
		first_name: "",
		last_name: "",
		email: "",
		service_id: "",
		phone_type: "",
	});

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
		required(root.service_id, { message: "Please select a service" });
	});

	accounts = httpResource<Array<Model.Premifly.Account>>(() =>
		this.formModel().service_id
			? {
					url: `${environment.url.api}/premifly/service/${this.formModel().service_id}/accounts`,
				}
			: undefined,
	);
}
