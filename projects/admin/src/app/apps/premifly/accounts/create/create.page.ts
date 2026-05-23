import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
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
import { PremiflyAccount } from "shared";

@Component({
	selector: "admin-create",
	imports: [
		RouterLink,
		ReactiveFormsModule,
		DatePipe,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatSnackBarModule,
		MatCardModule,
		FormField,
		FormRoot,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePage {
	#accountService = inject(PremiflyAccount);
	#router = inject(Router);
	#route = inject(ActivatedRoute);
	#snackBar = inject(MatSnackBar);

	// Signals-based form initialization
	form = form(
		signal({
			email: "",
			password: "",
			code: "",
			expires_at: "",
		}),
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

			required(root.password, { message: "Security password is required" });
			minLength(root.password, 6, {
				message: "Password must be at least 6 characters long",
			});

			required(root.code, { message: "Account code is required" });
			minLength(root.code, 3, {
				message: "Code must be at least 3 characters long",
			});
		},
		{
			submission: {
				action: (tree) => {
					const val = tree().value();

					const payload = {
						email: val.email,
						password: val.password,
						code: val.code,
						expires_at: val.expires_at ? new Date(val.expires_at).toISOString() : null,
					};

					return firstValueFrom(
						this.#accountService.create(payload).pipe(
							tap({
								next: () => {
									this.#snackBar.open(
										`Account "${this.form.email().value()}" created successfully!`,
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
											"Failed to create account. Please try again.",
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
