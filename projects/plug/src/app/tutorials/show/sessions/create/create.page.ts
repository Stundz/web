import { Component, inject, input } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatTimepickerModule } from "@angular/material/timepicker";
import {
	filter,
	switchMap,
	catchError,
	timer,
	map,
	startWith,
	tap,
} from "rxjs";
import { Tutorial } from "../../../../common/services/tutorial";
import { format, isAfter, parse, parseISO } from "date-fns";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "plug-create",
	imports: [
		MatInputModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatChipsModule,
		MatDatepickerModule,
		MatTimepickerModule,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.scss",
})
export class CreatePage {
	tutorialId = input.required<string>({ alias: ":tutorial" });
	private _fb = inject(FormBuilder);
	private _tutorialService = inject(Tutorial);

	protected form = this._fb.group({
		objectives: this._fb.array<string>([], {
			validators: [Validators.required, Validators.minLength(1)],
		}) as FormArray<FormControl<string>>,
		day: this._fb.control<Date | undefined>(undefined, {
			nonNullable: true,
			validators: [Validators.required],
		}) as FormControl<Date>,
		duration: this._fb.control<number>(60, {
			nonNullable: true,
			validators: [Validators.required],
		}),
		time: this._fb.control<Date | undefined>(undefined, {
			nonNullable: true,
			validators: [Validators.required],
		}) as FormControl<Date>,
	});

	loading = toSignal(
		this.form.events
			.pipe(filter((event) => event instanceof FormSubmittedEvent))
			.pipe(
				switchMap(() => {
					const { day, time, ...form } = this.form.getRawValue();

					return this._tutorialService
						.addSession(this.tutorialId(), {
							...form,
							day: new Date(
								day.getFullYear(),
								day.getMonth(),
								day.getDate(),
								time.getHours(),
								time.getMinutes(),
								time.getSeconds(),
								time.getMilliseconds(),
							).toISOString(),
						})
						.pipe(
							catchError(() => {
								// TODO: Handle past questions creation errors
								return timer(500).pipe(map(() => false));
							}),
							switchMap(() =>
								timer(500).pipe(
									map(() => false),
									tap(() => this.form.reset()),
								),
							),
							startWith(true),
						);
				}),
			),
		{
			initialValue: false,
		},
	);

	addObjective(objective: string) {
		this.form.controls.objectives.push(
			this._fb.control(objective, { nonNullable: true }),
		);
	}

	dateFilter(d: Date | null) {
		return isAfter(d || new Date(), new Date());
	}
}
