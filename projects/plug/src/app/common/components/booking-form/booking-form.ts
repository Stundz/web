import { CurrencyPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import {
	FormField,
	FormRoot,
	form,
	pattern,
	required,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../../../environments/environment";

@Component({
	selector: "plug-booking-form",
	imports: [MatButtonModule, MatInputModule, CurrencyPipe, FormField, FormRoot],
	templateUrl: "./booking-form.ng.html",
	styleUrl: "./booking-form.scss",
})
export class BookingForm {
	#http = inject(HttpClient);

	form = form(
		signal({
			phone: "",
		}),
		(root) => {
			required(root.phone, {
				message: "The phone number is required",
				when: ({ stateOf }) => stateOf(root).touched(),
			});
			pattern(root.phone, new RegExp(/^6[5789]\d{7}$/), {
				message:
					"Number should be a valid MTN/Orange Cameroon number without country code (237)",
			});
		},
		{
			submission: {
				action: (tree) => {
					return firstValueFrom(
						this.#http
							.post(`${environment.url.api}/plug/tutorial/book`, tree().value())
							.pipe(map(() => undefined)),
					);
				},
			},
		},
	);
}
