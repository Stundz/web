import { Location } from "@angular/common";
import { Component, inject, input, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import {
	email,
	FormField,
	FormRoot,
	form,
	required,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
	catchError,
	filter,
	firstValueFrom,
	map,
	startWith,
	switchMap,
	tap,
	throwError,
	timer,
} from "rxjs";
import { Auth, type Model, User } from "shared";

@Component({
	selector: "app-login",
	imports: [
		RouterLink,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatCheckboxModule,
		FormField,
		FormRoot,
	],
	templateUrl: "./login.page.ng.html",
	styleUrl: "./login.page.scss",
})
export class LoginPage {
	user = input.required<Model.User | undefined>();
	#route = inject(ActivatedRoute);
	#authService = inject(Auth);

	form = form(
		signal({
			email: "",
			password: "",
			remember: false,
		}),
		(root) => {
			required(root.email);
			email(root.email);
			required(root.password);
		},
		{
			submission: {
				action: (tree) => {
					return firstValueFrom(
						this.#authService
							.login(tree().value())
							.pipe(map(() => undefined))
							.pipe(
								tap(() => {
									console.log("What the fuck");
									window.location.href =
										this.#route.snapshot.queryParams["callback"] || "/";
								}),
								catchError((error) => {
									console.log("login error caught");
									return throwError(() => error);
								}),
							),
					);
				},
			},
		},
	);
}
