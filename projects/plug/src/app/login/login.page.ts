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
import {
	catchError,
	concat,
	exhaustMap,
	filter,
	map,
	of,
	switchMap,
	tap,
	throwError,
	timer,
} from "rxjs";
import { UserStore } from "../common/stores/user";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";

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

	protected readonly userStore = inject(UserStore);

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
	private submit$ = this.form.events.pipe(
		filter((event) => event instanceof FormSubmittedEvent),
		tap(() => console.log("Form has been submitted")),
		catchError((error) => {
			// TODO: Handle property manager login errors
			return throwError(() => error);
		}),
	);

	loading = toSignal(
		this.submit$.pipe(
			exhaustMap(() =>
				concat(
					of(true),
					this.userStore.login(this.form.getRawValue()).pipe(
						switchMap(() =>
							timer(400).pipe(
								map(() => false),
								tap(() => this._router.navigate(["/"])),
							),
						),
						catchError(() => timer(400).pipe(map(() => false))),
					),
				),
			),
		),
		{
			initialValue: false,
		},
	);
}
