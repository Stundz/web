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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { catchError, firstValueFrom, map, of, tap, throwError } from "rxjs";
import { PremiflyService } from "shared";

@Component({
	selector: "admin-create",
	imports: [
		RouterLink,
		ReactiveFormsModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatCheckboxModule,
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
	#service = inject(PremiflyService);
	#router = inject(Router);
	#route = inject(ActivatedRoute);
	#snackBar = inject(MatSnackBar);

	// Signals-based form initialization
	form = form(
		signal({
			name: "",
			price: 10, // Initialize as empty string so it starts empty in the input field
			enabled: true,
			limit: "" as string | null, // Initialize as empty string/null
		}),
		(root) => {
			required(root.name, { message: "Service name is required" });
			minLength(root.name, 3, {
				message: "Name must be at least 3 characters",
			});

			required(root.price, { message: "Price is required" });
			validate(root.price, ({ value }) => {
				const val = value();
				if (val === undefined || val === null) {
					return undefined; // Handled by 'required'
				}
				const numVal = Number(val);
				if (isNaN(numVal) || numVal < 0) {
					return {
						kind: "min",
						message: "Price must be a positive number",
					};
				}
				return undefined;
			});

			validate(root.limit, ({ value }) => {
				const val = value();
				if (val !== null && val !== undefined && val !== "") {
					const numVal = Number(val);
					if (isNaN(numVal) || numVal < 1) {
						return {
							kind: "min",
							message: "Limit must be at least 1 if specified",
						};
					}
				}
				return undefined;
			});
		},
		{
			submission: {
				action: (tree) => {
					const val = tree().value();

					// Format parameters cleanly
					const payload = {
						name: val.name,
						price: Number(val.price),
						enabled: Boolean(val.enabled),
						limit:
							val.limit !== "" && val.limit !== null && val.limit !== undefined
								? Number(val.limit)
								: null,
					};

					return firstValueFrom(
						this.#service.create(payload).pipe(
							tap({
								next: () => {
									this.#snackBar.open(
										`Service "${this.form.name().value()}" created successfully!`,
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
											"Failed to create service. Please try again.",
										"Close",
										{ duration: 5000 },
									);

									if (error.status == 422) {
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
