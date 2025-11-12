import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
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
import {
	FormSubmittedEvent,
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import {
	MatAutocompleteModule,
	MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import {
	catchError,
	debounceTime,
	filter,
	map,
	startWith,
	switchMap,
	tap,
	timer,
} from "rxjs";
import { Dropzone, Model, StunzValidator } from "shared";
import { environment } from "../../../environments/environment";
import { Tutor } from "../../common/services/tutor";

@Component({
	selector: "plug-create",
	imports: [
		MatButtonModule,
		MatAutocompleteModule,
		MatInputModule,
		MatSelectModule,
		MatCardModule,
		MatStepperModule,
		MatTableModule,
		ReactiveFormsModule,
		Dropzone,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.scss",
})
export class CreatePage {
	user = input.required<Model.User | undefined>();
	private _breakpointObserver = inject(BreakpointObserver);
	private _tutorService = inject(Tutor);
	#fb = inject(NonNullableFormBuilder);
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

	form = this.#fb.group({
		personal: this.#fb.group({
			first_name: this.#fb.control("", {
				validators: [Validators.required, Validators.minLength(3)],
			}),
			last_name: this.#fb.control("", {
				validators: [Validators.required, Validators.minLength(3)],
			}),
			email: this.#fb.control("", {
				validators: [Validators.required, Validators.email],
			}),
			phone: this.#fb.control("", {
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
		tutoring: this.#fb.group({
			courses: this.#fb.array<Array<Model.Plug.Course>>([], {
				validators: [Validators.required, Validators.min(1)],
			}),
		}),
		endorsement: this.#fb.group({
			endorsement: this.#fb.group({
				name: this.#fb.control<string | null>(null, {
					validators: [
						(control) => {
							if (control.parent?.get("email")?.value?.length) {
								return Validators.required(control);
							}
							return null;
						},
					],
				}),
				email: this.#fb.control<string | null>(null, {
					validators: [
						(control) => {
							if (control.parent?.get("name")?.value?.length) {
								return Validators.required(control);
							}
							return null;
						},
					],
				}),
			}),
		}),
		verification: this.#fb.group({
			profile: this.#fb.control<File | undefined>(undefined, {
				validators: [Validators.required, StunzValidator.file],
			}),
			transcript: this.#fb.control<File | undefined>(undefined, {
				validators: [
					Validators.required,
					StunzValidator.file,
					StunzValidator.size(500 * 1024),
				],
			}),
		}),
	});
	formData = toSignal(this.form.valueChanges.pipe(map((form) => [form])), {
		initialValue: [this.form.getRawValue()],
	});

	faculties = httpResource<Array<Model.Plug.Faculty>>(
		() =>
			this.user()?.plug?.department?.faculty?.institution_id
				? {
						url: `https://api.${environment.domain}/plug/institution/${this.user()?.plug?.department?.faculty?.institution_id}/faculties`,
					}
				: undefined,
		{
			defaultValue: [],
		},
	);

	profilePreview = toSignal(
		this.form.controls.verification.controls.profile.valueChanges.pipe(
			filter((data) => data instanceof File),
			map((file) => URL.createObjectURL(file)),
		),
	);

	courseSearch = this.#fb.control<Model.Plug.Course | string>("");
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

	loading = toSignal(
		this.form.events
			.pipe(filter((event) => event instanceof FormSubmittedEvent))
			.pipe(
				switchMap(() =>
					this._tutorService
						.create(
							Object.assign({}, ...Object.values(this.form.getRawValue())),
						)
						.pipe(
							catchError(() => {
								// TODO: Handle past questions creation errors
								return timer(500).pipe(map(() => false));
							}),
							switchMap(() =>
								timer(500).pipe(
									map(() => false),
									tap(() => {
										this._snackBar.open(
											"Your application was saved successfully and awaiting a review.",
										);
										this.form
											?.get("tutoring")
											?.get("courses")
											?.setValue([], { emitEvent: false });
										this.form.reset();
									}),
								),
							),
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
			this.courses.hasValue()
				? this.form.controls.tutoring.controls.courses.enable()
				: this.form.controls.tutoring.controls.courses.disable();
		});

		effect(() => {
			if (this.user() === undefined) {
				this.form.disable();
			} else {
				if (this.user()?.plug?.tutor) {
					this.form.disable();
					this._snackBar.open(
						"You have already applied to become a tutor",
						"",
						{
							duration: 5000,
							horizontalPosition: "center",
							verticalPosition: "top",
						},
					);
				} else {
					this.form.enable();
					this.form.controls.personal.patchValue({
						first_name: this.user()?.first_name,
						last_name: this.user()?.last_name,
						email: this.user()?.email,
					});
				}
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

		this.form.controls.tutoring.controls.courses.push(this.#fb.control(course));
		this.courseSearch.setValue("");
	}

	courseDisplay = (course: Model.Plug.Course | undefined) => {
		return "";
	};

	handleUpload(file: File) {
		console.log(file);
	}
}
