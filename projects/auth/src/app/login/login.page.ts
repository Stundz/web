import { Location } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
	catchError,
	filter,
	map,
	startWith,
	switchMap,
	tap,
	timer,
} from "rxjs";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { Model, User } from "shared";

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
	user = input.required<Model.User | undefined>();
	private _fb = inject(FormBuilder);
	private _router = inject(Router);
	private _route = inject(ActivatedRoute);
	private _location = inject(Location);
	private _snackBar = inject(MatSnackBar);
	private _userService = inject(User);

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
						switchMap(() => timer(500).pipe(map(() => false))),
						catchError(() => {
							// TODO: Handle past questions creation errors
							return timer(500).pipe(map(() => false));
						}),
						tap(() => {
							const callback =
								this._route.snapshot.queryParamMap.get("callback");
							if (callback != null) {
								window.location.replace(callback);
							} else {
								this._router.navigateByUrl("/");
							}
						}),
						startWith(true),
					),
				),
			),
		{
			initialValue: false,
		},
	);
}
