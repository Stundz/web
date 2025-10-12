import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";

@Component({
	selector: "app-signup",
	imports: [RouterLink, MatButtonModule, MatInputModule, ReactiveFormsModule],
	templateUrl: "./signup.page.ng.html",
	styleUrl: "./signup.page.scss",
})
export class SignupPage {
	private _fb = inject(FormBuilder);

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
}
