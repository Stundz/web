import { httpResource } from "@angular/common/http";
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
import { Model } from "shared";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { filter, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "plug-signup-form",
	imports: [ReactiveFormsModule, MatInputModule, MatSelectModule],
	templateUrl: "./signup-form.ng.html",
	styleUrl: "./signup-form.scss",
})
export class SignupForm {
	private _fb = inject(FormBuilder);
	private _snackBar = inject(MatSnackBar);
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
		program: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		level: this._fb.control("", {
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

	constructor() {
		effect(() => {
			this.faculties.hasValue()
				? this.form.controls.faculty_id.enable()
				: this.form.controls.faculty_id.disable();

			this.departments.hasValue()
				? this.form.controls.department_id.enable()
				: this.form.controls.department_id.disable();
		});

		this.form.events
			.pipe(
				takeUntilDestroyed(),
				filter((event) => event instanceof FormSubmittedEvent),
				tap(() => {
					this.dialogRef.close();
					this._snackBar.open(
						"Thanks for filling out the form. enjoy your stay here",
						"",
						{
							duration: 4000,
						},
					);
				}),
			)
			.subscribe();
	}
}
