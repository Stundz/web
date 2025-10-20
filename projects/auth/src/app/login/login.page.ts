import { Location } from "@angular/common";
import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink } from "@angular/router";
import { catchError, filter, map, startWith, switchMap, timer } from "rxjs";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { User } from "shared";

@Component({
	selector: "app-login",
	imports: [
		RouterLink,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatCheckboxModule,
	],
	templateUrl: "./login.page.ng.html",
	styleUrl: "./login.page.scss",
})
export class LoginPage {
	private _fb = inject(FormBuilder);
	private _router = inject(Router);
	private _location = inject(Location);
	private _snackBar = inject(MatSnackBar);
	private _userService = inject(User);

	protected readonly user = this._userService.user.asReadonly().value();

	form = this._fb.group({
		email: this._fb.control<string>("", {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
		password: this._fb.control<string>("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		remember: this._fb.control<boolean>(false),
	});

	loading = toSignal(
		this.form.events
			.pipe(filter((event) => event instanceof FormSubmittedEvent))
			.pipe(
				switchMap(() =>
					this._userService.login(this.form.getRawValue()).pipe(
						catchError(() => {
							// TODO: Handle past questions creation errors
							return timer(500).pipe(map(() => false));
						}),
						switchMap(() => timer(500).pipe(map(() => false))),
						startWith(true),
					),
				),
			),
		{
			initialValue: false,
		},
	);
}
