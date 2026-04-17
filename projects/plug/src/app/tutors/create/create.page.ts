import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { isPlatformBrowser } from "@angular/common";
import { httpResource } from "@angular/common/http";
import {
	Component,
	effect,
	inject,
	input,
	linkedSignal,
	PLATFORM_ID,
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
	disabled,
	email,
	FormField,
	FormRoot,
	form,
	minLength,
	pattern,
	required,
	validate,
} from "@angular/forms/signals";
import {
	MatAutocompleteModule,
	type MatAutocompleteSelectedEvent,
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
import { Dropzone, type Model, StunzValidator } from "shared";
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
		FormRoot,
		FormField,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.scss",
})
export class CreatePage {
	user = input.required<Model.User | undefined>();
	private _breakpointObserver = inject(BreakpointObserver);
	private _tutorService = inject(Tutor);
	#fb = inject(NonNullableFormBuilder);
	#snackBar = inject(MatSnackBar);
	#platformId = inject(PLATFORM_ID);

	stepperOrientation = toSignal(
		this._breakpointObserver
			.observe([Breakpoints.Small, Breakpoints.XSmall])
			.pipe(map((state) => (state.matches ? "vertical" : "horizontal"))),
		{
			initialValue: "horizontal",
		},
	);

	formModel = linkedSignal(() => ({
		personal: {
			first_name: this.user()?.first_name || "",
			last_name: this.user()?.last_name || "",
			email: this.user()?.email || "",
			phone: "",
		},
		tutoring: {
			courses: [] as Array<Model.Plug.Course>,
		},
		endorsement: {
			name: "",
			email: "",
		},
		verification: {
			profile: null as File | null,
			transacript: undefined as File | undefined,
		},
	}));

	f = form(this.formModel, (root) => {
		required(root.personal.first_name, {
			message: "This field is required",
			when: ({ stateOf }) => stateOf(root).touched(),
		});
		minLength(root.personal.first_name, 3, {
			message: "The minimum required number of characters is 3",
		});

		required(root.personal.last_name, {
			message: "This field is required",
			when: ({ stateOf }) => stateOf(root).touched(),
		});
		minLength(root.personal.last_name, 3, {
			message: "The minimum required number of characters is 3",
		});

		required(root.personal.email, {
			message: "This field is required",
			when: ({ stateOf }) => stateOf(root).touched(),
		});
		email(root.personal.email, { message: "Invalid email" });

		required(root.personal.phone, {
			message: "This field is required",
			when: ({ stateOf }) => stateOf(root).touched(),
		});
		pattern(root.personal.phone, /^\+?(237)?6[87259][0-9]{7}$/, {
			message: "Invalid phone number",
		});

		required(root.tutoring.courses, {
			message: "This field is required",
			when: ({ stateOf }) => stateOf(root.tutoring).touched(),
		});
		minLength(root.tutoring.courses, 3, {
			message: "You must select at least 1 course",
		});

		required(root.verification.profile, {
			message: "Please provide a profile photo",
			when: ({ stateOf }) => stateOf(root).touched(),
		});
		validate(root.verification.profile, ({ value }) => {
			if (value() instanceof File) {
				return undefined;
			}

			return {
				kind: "file",
				message: "Upload a valid profile photo",
			};
		});
	});

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

	constructor() {
		effect(() => {
			if (!this.user()) {
				// TODO: Disable form
			} else {
				if (this.user()?.plug?.tutor) {
					// TODO: Disble form

					if (isPlatformBrowser(this.#platformId))
						this.#snackBar.open(
							"You have already applied to become a tutor",
							"",
							{
								duration: 5000,
								horizontalPosition: "center",
								verticalPosition: "top",
							},
						);
				}
			}
		});
	}

	removeCourse(index: number) {
		this.f.tutoring
			.courses()
			.value.update((value) => value.filter((_, i) => i !== index));
	}

	addCourse(e: MatAutocompleteSelectedEvent) {
		const course: Model.Plug.Course = e.option.value;

		if (this.f.tutoring.courses().value().length > 2) {
			this.#snackBar.open("You cannot add more than 3 courses", "", {
				duration: 3000,
				politeness: "assertive",
			});
			return;
		}

		if (
			this.f.tutoring
				.courses()
				.value()
				.some((c) => c.id === course.id)
		) {
			this.#snackBar.open("This course has already been added", "", {
				duration: 3000,
				politeness: "assertive",
			});
			return;
		}

		this.f.tutoring.courses().value.update((value) => [...value, course]);
		this.courseSearch.reset("");
	}

	courseDisplay = (course: Model.Plug.Course | undefined) => {
		return "";
	};
}
