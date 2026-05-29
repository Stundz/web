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
	email,
	FormField,
	FormRoot,
	form,
	minLength,
	pattern,
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
		}),
		(root) => {
			required(root.email, { message: "Account email is required" });
			email(root.email, {
				message: "Please enter a valid email address",
			});
			pattern(root.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
				message: "Please enter a valid email address",
			});
			//
			// required(root.password, { message: "Security password is required" });
			// minLength(root.password, 6, {
			// 	message: "Password must be at least 6 characters long",
			// });
			//
			// required(root.code, { message: "Account code is required" });
			// minLength(root.code, 3, {
			// 	message: "Code must be at least 3 characters long",
			// });
		},
		{
			submission: {
				action: (tree) => {
					const val = tree().value();

					const payload = {
						email: val.email,
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
