import { CurrencyPipe } from "@angular/common";
import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import {
	FormField,
	FormRoot,
	form,
	pattern,
	required,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, firstValueFrom, map, tap, throwError } from "rxjs";
import type { Model } from "shared";
import { environment } from "../../../../../environments/environment";

@Component({
	selector: "premifly-subscription-payment",
	imports: [
		FormRoot,
		FormField,
		CurrencyPipe,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
	],
	templateUrl: "./subscription-payment.ng.html",
	styleUrl: "./subscription-payment.css",
})
export class SubscriptionPayment {
	readonly #dialogRef = inject(MatDialogRef<SubscriptionPayment>);
	#http = inject(HttpClient);
	#snackBar = inject(MatSnackBar);
	data = inject<{
		service: Model.Premifly.Service;
		duration: number;
		phone: string;
		device_type: string;
	}>(MAT_DIALOG_DATA);

	form = form(
		signal({
			service_id: this.data.service?.id,
			payer: this.data.phone,
			phone: this.data.phone,
			device_type: this.data.device_type,
		}),
		(root) => {
			required(root.payer, {
				message: "The phone number is required",
				when: ({ stateOf }) => stateOf(root).touched(),
			});
			pattern(root.payer, new RegExp(/^6[5789]\d{7}$/), {
				message:
					"Number should be a valid MTN/Orange Cameroon number without country code (237)",
			});
		},
		{
			submission: {
				action: (tree) => {
					return firstValueFrom(
						this.#http
							.post(
								`${environment.url.api}/premifly/service/${tree.service_id().value()}/subscription`,
								tree().value(),
							)
							.pipe(
								map(() => undefined),
								tap(() => {
									this.#dialogRef.close(true);
								}),
								catchError((error: HttpErrorResponse) => {
									this.#snackBar.open(
										error.error.message ||
											"Error encountered while processing your subscription",
										"",
										{
											politeness: "assertive",
											duration: 10000,
											verticalPosition: "top",
											horizontalPosition: "end",
										},
									);

									return throwError(() => error);
								}),
							),
					);
				},
			},
		},
	);
}
