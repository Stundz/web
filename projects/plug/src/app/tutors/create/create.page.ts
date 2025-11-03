import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { NgTemplateOutlet } from "@angular/common";
import { httpResource } from "@angular/common/http";
import {
	ChangeDetectorRef,
	Component,
	effect,
	inject,
	input,
	signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import {
	MatAutocompleteModule,
	MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs";
import { Dropzone, Model } from "shared";
import { environment } from "../../../environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "plug-create",
	imports: [
		MatButtonModule,
		MatAutocompleteModule,
		MatInputModule,
		MatSelectModule,
		MatCardModule,
		MatStepperModule,
		ReactiveFormsModule,
		NgTemplateOutlet,
		Dropzone,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.scss",
})
export class CreatePage {
	user = input.required<Model.User | undefined>();
	private _breakpointObserver = inject(BreakpointObserver);
	private _fb = inject(FormBuilder);
	private _cdr = inject(ChangeDetectorRef);
	private _snackBar = inject(MatSnackBar);

	stepperOrientation = toSignal(
		this._breakpointObserver
			.observe([Breakpoints.Small, Breakpoints.XSmall])
			.pipe(map((state) => (state.matches ? "vertical" : "horizontal"))),
		{
			initialValue: "horizontal",
		},
	);

	form = this._fb.group({
		personal: this._fb.group({
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
			phone: this._fb.control("", {
				nonNullable: true,
				validators: [
					Validators.required,
					(control) => {
						if (!/^\+?(237)?6[87259][0-9]{7}$/.test(control.value)) {
							return {
								tel: false,
							};
						}

						return null;
					},
				],
			}),
		}),
		academic: this._fb.group({
			institution_id: this._fb.control<string>("", {
				nonNullable: true,
				validators: [Validators.required],
			}),
			faculty_id: this._fb.control<string>("", {
				nonNullable: true,
				validators: [Validators.required],
			}),
			department_id: this._fb.control<string>("", {
				nonNullable: true,
				validators: [Validators.required],
			}),
			matricule: this._fb.control("", {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(3)],
			}),
		}),
		tutoring: this._fb.group({
			courses: this._fb.array<Array<Model.Plug.Course>>([], {
				validators: [Validators.required, Validators.min(1)],
			}),
		}),
		verification: this._fb.group({
			profile: this._fb.control<File | undefined>(undefined, {
				nonNullable: true,
				validators: [
					(control) => {
						if (control.value! instanceof File) {
							return { file: false };
						}
						return null;
					},
				],
			}),
			transcript: this._fb.control<File | undefined>(undefined, {
				nonNullable: true,
				validators: [
					(control) => {
						if (control.value! instanceof File) {
							return { file: false };
						}
						return null;
					},
				],
			}),
		}),
	});

	institutions = httpResource<Array<Model.Plug.Institution>>(
		() => `https://api.${environment.domain}/plug/institutions`,
	);
	institution = toSignal(
		this.form.controls.academic.controls.institution_id.valueChanges.pipe(
			filter((id) => !!id),
			map((id) => this.institutions.value()?.find((i) => i.id === id)),
		),
	);

	faculty = toSignal(
		this.form.controls.academic.controls.faculty_id.valueChanges.pipe(
			map((id) => this.faculties.value().find((f) => f.id === id)),
		),
		{
			initialValue: undefined,
		},
	);
	department = toSignal(
		this.form.controls.academic.controls.department_id.valueChanges.pipe(
			map((id) => this.departments.value().find((d) => d.id === id))!,
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

	courseSearch = this._fb.control<Model.Plug.Course | string>("");
	tutoringFaculty = signal<string | undefined>(undefined);
	courses = httpResource<Array<Model.Plug.Course>>(
		() =>
			this.tutoringFaculty() !== undefined
				? {
						url: `https://api.${environment.domain}/plug/faculty/${this.tutoringFaculty()}/courses`,
					}
				: undefined,
		{
			defaultValue: [],
		},
	);
	filteredCourses = toSignal(
		this.courseSearch.valueChanges.pipe(
			debounceTime(300),
			filter((value) => value === null || typeof value === "string"),
			map((value) => {
				const query = value ? value.toLocaleLowerCase() : "";
				return this.courses
					.value()
					.filter(
						(course) =>
							course.code.toLowerCase().includes(query) ||
							course.title.toLowerCase().includes(query),
					);
			}),
		),
		{ initialValue: [] },
	);

	// loading = toSignal(
	// 	this.form.events
	// 		.pipe(filter((event) => event instanceof FormSubmittedEvent))
	// 		.pipe(
	// 			switchMap(() =>
	// 				this._pastQuestionService.create(this.form.getRawValue()).pipe(
	// 					catchError(() => {
	// 						// TODO: Handle past questions creation errors
	// 						return timer(500).pipe(map(() => false));
	// 					}),
	// 					switchMap(() => timer(500).pipe(map(() => false))),
	// 					startWith(true),
	// 				),
	// 			),
	// 		),
	// 	{
	// 		initialValue: false,
	// 	},
	// );

	constructor() {
		effect(() => {
			this.faculties.hasValue()
				? this.form.controls.academic.controls.faculty_id.enable()
				: this.form.controls.academic.controls.faculty_id.disable();

			this.departments.hasValue()
				? this.form.controls.academic.controls.department_id.enable()
				: this.form.controls.academic.controls.department_id.disable();

			this.courses.hasValue()
				? this.form.controls.tutoring.controls.courses.enable()
				: this.form.controls.tutoring.controls.courses.disable();
		});

		effect(() => {
			if (this.user() !== undefined) {
				this.form.controls.personal.patchValue({
					first_name: this.user()?.first_name,
					last_name: this.user()?.last_name,
					email: this.user()?.email,
				});
			}
		});
	}

	removeCourse(index: number) {
		this.form.controls.tutoring.controls.courses.removeAt(index);
	}

	addCourse(e: MatAutocompleteSelectedEvent) {
		const course: Model.Plug.Course = e.option.value;

		if (
			this.form.controls.tutoring.controls.courses.value.some(
				(c) => c?.id === course.id,
			)
		) {
			this._snackBar.open("This course has already been added", "", {
				duration: 3000,
				politeness: "assertive",
			});
			return;
		}

		this.form.controls.tutoring.controls.courses.push(this._fb.control(course));
		this.courseSearch.setValue("");
	}

	courseDisplay = (course: Model.Plug.Course | undefined) => {
		return "";
	};
}
