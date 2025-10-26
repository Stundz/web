import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, filter, map, startWith, switchMap, timer } from "rxjs";
import { User } from "shared";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-signup",
	imports: [RouterLink, MatButtonModule, MatInputModule, ReactiveFormsModule],
	templateUrl: "./signup.page.ng.html",
	styleUrl: "./signup.page.scss",
})
export class SignupPage {
	private _userService = inject(User);
	private _fb = inject(FormBuilder);

	googleUrl = `https://oauth.${environment.domain}/auth/google/redirect`;

	form = this._fb.group({
		first_name: this._fb.control("", { nonNullable: true }),
		last_name: this._fb.control("", { nonNullable: true }),
		email: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
		password: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(8)],
		}),
		password_confirmation: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(8)],
		}),
	});

	loading = toSignal(
		this.form.events
			.pipe(filter((event) => event instanceof FormSubmittedEvent))
			.pipe(
				switchMap(() =>
					this._userService.signup(this.form.getRawValue()).pipe(
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
