import { Component, inject, input } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormSubmittedEvent,
	ReactiveFormsModule,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { filter, switchMap, catchError, timer, map, startWith } from "rxjs";
import { Tutorial } from "../../../../common/services/tutorial";
import { format } from "date-fns";
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
		objectives: this._fb.array<string>([]) as FormArray<FormControl<string>>,
		day: this._fb.control<string>("", { nonNullable: true }),
		duration: this._fb.control<number>(60, { nonNullable: true }),
		time: this._fb.control<string>("", { nonNullable: true }),
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
							day: format(new Date(day), "yyyy-MM-dd"),
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

	addObjective(objective: string) {
		this.form.controls.objectives.push(
			this._fb.control(objective, { nonNullable: true }),
		);
	}
}
