import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	linkedSignal,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
	FormField,
	FormRoot,
	form,
	minLength,
	required,
	validate,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { catchError, firstValueFrom, map, of, tap, throwError } from "rxjs";
import { type Model, PremiflyAccount } from "shared";

@Component({
	selector: "admin-edit",
	imports: [
		RouterLink,
		ReactiveFormsModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatSnackBarModule,
		MatCardModule,
		FormField,
		FormRoot,
	],
	templateUrl: "./edit.page.ng.html",
	styleUrl: "./edit.page.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPage {
	#accountService = inject(PremiflyAccount);
	#router = inject(Router);
	#route = inject(ActivatedRoute);
	#snackBar = inject(MatSnackBar);

	// Strongly typed signal input for resolved account
	account = input.required<Model.Premifly.Account>();

	// Sync resolved route data to form state
	formState = linkedSignal(() => {
		const acc = this.account();
		const dateObj = acc.expires_at ? new Date(acc.expires_at) : null;
		const offset = dateObj ? dateObj.getTimezoneOffset() : 0;
		const localDate = dateObj
			? new Date(dateObj.getTime() - offset * 60 * 1000)
			: null;
		const expiresStr = localDate
			? localDate.toISOString().substring(0, 16)
			: "";

		return {
			email: acc.email,
		};
	});

	// Signals-based form initialization
	form = form(
		this.formState,
		(root) => {
			required(root.email, { message: "Account email is required" });
			validate(root.email, ({ value }) => {
				const val = value();
				if (val === undefined || val === null || val === "") {
					return undefined; // Handled by 'required'
				}
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(val)) {
					return {
						kind: "email",
						message: "Please enter a valid email address",
					};
				}
				return undefined;
			});
		},
		{
			submission: {
				action: (tree) => {
					const val = tree().value();

					const payload = {
						email: val.email,
					};

					return firstValueFrom(
						this.#accountService.update(this.account().id, payload).pipe(
							tap({
								next: () => {
									this.#snackBar.open(
										`Account ${this.account().email} updated to "${this.form.email().value()}" successfully!`,
										"Close",
										{
											duration: 3000,
											horizontalPosition: "center",
											verticalPosition: "bottom",
										},
									);
								},
							}),
							map(() => undefined),
							tap(() => {
								this.#router.navigate([".."], { relativeTo: this.#route });
							}),
							catchError((error) => {
								if (error instanceof HttpErrorResponse) {
									this.#snackBar.open(
										error?.error?.message ||
											"Failed to update account. Please try again.",
										"Close",
										{ duration: 5000 },
									);

									if (error.status === 422) {
										return of(undefined);
									}
								}
								return throwError(() => error);
							}),
						),
					);
				},
			},
		},
	);
}
