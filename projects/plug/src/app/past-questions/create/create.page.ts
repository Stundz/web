import { httpResource } from "@angular/common/http";
import { Component, effect, inject } from "@angular/core";
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { environment } from "../../../environments/environment";
import { toSignal } from "@angular/core/rxjs-interop";
import { Dropzone, Model } from "shared";
import { MatIconModule } from "@angular/material/icon";
import {
	catchError,
	filter,
	map,
	startWith,
	switchMap,
	throwError,
	timer,
} from "rxjs";
import { PastQuestion } from "../../common/services/past-question";

@Component({
	selector: "app-create",
	imports: [
		ReactiveFormsModule,
		MatStepperModule,
		MatButtonModule,
		MatIconModule,
		Dropzone,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.scss",
})
export class CreatePage {
	private _pastQuestionService = inject(PastQuestion);
	private _fb = inject(FormBuilder);

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
		course_id: this._fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
		year: this._fb.control<number>(0, {
			nonNullable: true,
			validators: [Validators.required],
		}),
		file: this._fb.control<File | null>(null, {
			validators: [],
		}),
	});

	institutions = httpResource<Array<Model.Plug.Institution>>(
		() => ({
			url: `https://api.${environment.domain}/plug/institutions`,
		}),
		{ defaultValue: [] },
	);

	institution = toSignal(
		this.form.controls.institution_id.valueChanges.pipe(
			map((id) => this.institutions.value().find((i) => i.id === id)),
		),
		{
			initialValue: undefined,
		},
	);
	faculty = toSignal(
		this.form.controls.faculty_id.valueChanges.pipe(
			map((id) => this.faculties.value().find((f) => f.id === id)),
		),
		{
			initialValue: undefined,
		},
	);
	department = toSignal(
		this.form.controls.department_id.valueChanges.pipe(
			map((id) => this.departments.value().find((d) => d.id === id))!,
		),
		{
			initialValue: undefined,
		},
	);
	course = toSignal(
		this.form.controls.course_id.valueChanges.pipe(
			map((id) => this.courses.value().find((d) => d.id === id))!,
		),
		{
			initialValue: undefined,
		},
	);

	faculties = httpResource<Array<Model.Plug.Faculty>>(
		() =>
			this.institution() !== undefined
				? {
						url: `https://api.${environment.domain}/plug/institution/${this.institution()!.id}/faculties`,
					}
				: undefined,
		{
			defaultValue: [],
		},
	);
	departments = httpResource<Array<Model.Plug.Faculty>>(
		() =>
			this.faculty() !== undefined
				? {
						url: `https://api.${environment.domain}/plug/faculty/${this.faculty()!.id}/departments`,
					}
				: undefined,
		{
			defaultValue: [],
		},
	);
	courses = httpResource<Array<Model.Plug.Course>>(
		() =>
			this.department() !== undefined
				? {
						url: `https://api.${environment.domain}/plug/department/${this.department()!.id}/courses`,
					}
				: undefined,
		{
			defaultValue: [],
		},
	);

	loading = toSignal(
		this.form.events
			.pipe(filter((event) => event instanceof FormSubmittedEvent))
			.pipe(
				switchMap(() =>
					this._pastQuestionService.create(this.form.getRawValue()).pipe(
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

	constructor() {
		effect(() => {
			this.faculties.hasValue()
				? this.form.controls.faculty_id.enable()
				: this.form.controls.faculty_id.disable();

			this.departments.hasValue()
				? this.form.controls.department_id.enable()
				: this.form.controls.department_id.disable();

			this.courses.hasValue()
				? this.form.controls.course_id.enable()
				: this.form.controls.course_id.disable();
		});
	}
}
