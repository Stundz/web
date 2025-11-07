import { HttpClient, httpResource } from "@angular/common/http";
import { Component, effect, inject } from "@angular/core";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { environment } from "../../../../environments/environment";
import { Model, User } from "shared";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
	catchError,
	filter,
	map,
	startWith,
	switchMap,
	tap,
	timer,
} from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "plug-signup-form",
	imports: [
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
	],
	templateUrl: "./signup-form.ng.html",
	styleUrl: "./signup-form.scss",
})
export class SignupForm {
	private _fb = inject(FormBuilder);
	private _snackBar = inject(MatSnackBar);
	private _http = inject(HttpClient);
	#userService = inject(User);
	dialogRef = inject(MatDialogRef<SignupForm>);

	form = this._fb.group({
		institution_id: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		faculty_id: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		department_id: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		program_id: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		level_id: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
	});

	institutions = httpResource<Array<Model.Plug.Institution>>(() => ({
		url: `https://api.${environment.domain}/plug/institutions`,
	}));
	institution = toSignal(this.form.controls.institution_id.valueChanges.pipe());

	faculties = httpResource<Array<Model.Plug.Institution>>(() =>
		this.institution()
			? {
					url: `https://api.${environment.domain}/plug/institution/${this.institution()}/faculties`,
				}
			: undefined,
	);
	faculty = toSignal(this.form.controls.faculty_id.valueChanges);

	departments = httpResource<Array<Model.Plug.Institution>>(() =>
		this.faculty()
			? {
					url: `https://api.${environment.domain}/plug/faculty/${this.faculty()}/departments`,
				}
			: undefined,
	);

	programs = httpResource<Array<Model.Plug.Institution>>(() => ({
		url: `https://api.${environment.domain}/plug/programs`,
	}));
	program = toSignal(this.form.controls.program_id.valueChanges);

	levels = httpResource<Array<Model.Plug.Institution>>(() =>
		this.program()
			? {
					url: `https://api.${environment.domain}/plug/program/${this.program()}/levels`,
				}
			: undefined,
	);

	loading = toSignal(
		this.form.events.pipe(
			takeUntilDestroyed(),
			filter((event) => event instanceof FormSubmittedEvent),
			switchMap(() =>
				this._http
					.post(
						`https://api.${environment.domain}/plug/user`,
						this.form.getRawValue(),
					)
					.pipe(
						switchMap(() =>
							timer(500).pipe(
								map(() => false),

								tap(() => {
									this.dialogRef.close();

									this.#userService.fetchUser();

									this._snackBar.open(
										"Thanks for filling out the form. enjoy your stay here",
										"",
										{
											duration: 4000,
										},
									);
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
		{ initialValue: false },
	);

	constructor() {
		effect(() => {
			this.faculties.hasValue()
				? this.form.controls.faculty_id.enable()
				: this.form.controls.faculty_id.disable();

			this.departments.hasValue()
				? this.form.controls.department_id.enable()
				: this.form.controls.department_id.disable();

			this.levels.hasValue()
				? this.form.controls.level_id.enable()
				: this.form.controls.level_id.disable();
		});
	}
}
