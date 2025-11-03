import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	catchError,
	filter,
	map,
	startWith,
	switchMap,
	tap,
	timer,
} from "rxjs";
import { User } from "shared";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-signup",
	imports: [RouterLink, MatButtonModule, MatInputModule, ReactiveFormsModule],
	templateUrl: "./signup.page.ng.html",
	styleUrl: "./signup.page.scss",
})
export class SignupPage {
	private _router = inject(Router);
	private _route = inject(ActivatedRoute);
	private _userService = inject(User);
	private _fb = inject(FormBuilder);

	googleUrl = `https://oauth.${environment.domain}/auth/google/redirect${!!this._route.snapshot.queryParams["callback"] ? "?stundz_callback=" + this._route.snapshot.queryParams["callback"] : ""}`;

	form = this._fb.group({
		first_name: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(3)],
		}),
		last_name: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(3)],
		}),
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
						switchMap(() =>
							timer(500).pipe(
								map(() => false),
								tap(() => {
									const callback =
										this._route.snapshot.paramMap.get("callback");
									if (callback != null) {
										window.location.replace(callback);
									} else {
										this._router.navigateByUrl("/");
									}
								}),
							),
						),
						catchError((response) => {
							const { errors } = response.error;

							Object.keys(errors).forEach((key) => {
								this.form.get(key)?.setErrors({ response: errors[key][0] });
							});

							// TODO: Handle past questions creation errors
							console.log(errors);

							return timer(500).pipe(map(() => false));
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
