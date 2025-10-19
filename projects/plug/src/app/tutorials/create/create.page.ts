import { format } from "date-fns";
import { httpResource } from "@angular/common/http";
import { Component, effect, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { catchError, filter, map, startWith, switchMap, timer } from "rxjs";
import { Dropzone, Model } from "shared";
import { environment } from "../../../environments/environment";
import { MatSelectModule } from "@angular/material/select";
import { Tutorial } from "../../common/services/tutorial";
import { DomSanitizer } from "@angular/platform-browser";
import { MatTimepickerModule } from "@angular/material/timepicker";

@Component({
	selector: "app-create",
	imports: [
		MatButtonModule,
		MatInputModule,
		MatChipsModule,
		MatDatepickerModule,
		MatCardModule,
		MatInputModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatTimepickerModule,
		Dropzone,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.scss",
	providers: [provideNativeDateAdapter()],
})
export class CreatePage {
	private _fb = inject(FormBuilder);
	private _tutorialService = inject(Tutorial);
	private _sanitizer = inject(DomSanitizer);

	form = this._fb.group({
		name: this._fb.control<string>("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(5)],
		}),
		duration: this._fb.control<number>(60, {
			nonNullable: true,
			validators: [Validators.required, Validators.min(60)],
		}),
		day: this._fb.control<string>("", { nonNullable: true }),
		time: this._fb.control<string>("", { nonNullable: true }),
		description: this._fb.control<string>("", {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(20)],
		}),
		objectives: this._fb.array<string>([], {
			validators: [Validators.required, Validators.minLength(1)],
		}) as FormArray<FormControl<string>>,
		price: this._fb.control<number>(300, { nonNullable: true }),
		cover: this._fb.control<File | undefined>(undefined, {
			nonNullable: true,
			validators: [Validators.required],
		}),
		institution_id: this._fb.control<string>("", { nonNullable: true }),
		faculty_id: this._fb.control<string>("", { nonNullable: true }),
		department_id: this._fb.control<string>("", { nonNullable: true }),
		course_id: this._fb.control<string>("", { nonNullable: true }),
	});

	intitutions = httpResource<Array<Model.Institution>>(() => ({
		url: `https://api.${environment.domain}/plug/institutions`,
	}));

	institution = toSignal(this.form.controls.institution_id.valueChanges, {
		initialValue: "",
	});
	faculty = toSignal(this.form.controls.faculty_id.valueChanges, {
		initialValue: "",
	});
	department = toSignal(this.form.controls.department_id.valueChanges, {
		initialValue: "",
	});
	coverPreview = toSignal(
		this.form.controls.cover.valueChanges.pipe(
			filter((cover) => cover instanceof File),
			map((file) =>
				this._sanitizer.bypassSecurityTrustResourceUrl(
					URL.createObjectURL(file),
				),
			),
		),
		{ initialValue: null },
	);

	faculties = httpResource<Array<Model.Faculty>>(() =>
		!!this.institution()
			? {
					url: `https://api.${environment.domain}/plug/institution/${this.institution()}/faculties`,
				}
			: undefined,
	);
	departments = httpResource<Array<Model.Faculty>>(() =>
		!!this.faculty()
			? {
					url: `https://api.${environment.domain}/plug/faculty/${this.faculty()}/departments`,
				}
			: undefined,
	);
	courses = httpResource<Array<Model.Course>>(() =>
		!!this.department()
			? {
					url: `https://api.${environment.domain}/plug/department/${this.department()}/courses`,
				}
			: undefined,
	);

	loading = toSignal(
		this.form.events
			.pipe(filter((event) => event instanceof FormSubmittedEvent))
			.pipe(
				switchMap(() => {
					const { day, time, ...form } = this.form.getRawValue();

					return this._tutorialService
						.create({
							...form,
							day: format(new Date(day), "yyyy-MM-dd"),
							time: format(new Date(time), "HH:mm:ss"),
						})
						.pipe(
							catchError(() => {
								// TODO: Handle past questions creation errors
								return timer(500).pipe(map(() => false));
							}),
							switchMap(() => timer(500).pipe(map(() => false))),
							startWith(true),
						);
				}),
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

	addObjective(objective: string) {
		this.form.controls.objectives.push(
			this._fb.control(objective, { nonNullable: true }),
		);
	}
}
