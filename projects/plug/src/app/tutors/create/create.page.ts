import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";

@Component({
	selector: "plug-create",
	imports: [
		MatInputModule,
		MatSelectModule,
		MatStepperModule,
		ReactiveFormsModule,
	],
	templateUrl: "./create.page.ng.html",
	styleUrl: "./create.page.scss",
})
export class CreatePage {
	private _breakpointObserver = inject(BreakpointObserver);
	private _fb = inject(FormBuilder);

	stepperOrientation = toSignal(
		this._breakpointObserver
			.observe([Breakpoints.Small, Breakpoints.XSmall])
			.pipe(map((state) => (state.matches ? "vertical" : "horizontal"))),
		{
			initialValue: "horizontal",
		},
	);

	form = this._fb.group({
		personal: this._fb.group({}),
		academic: this._fb.group({}),
		tutoring: this._fb.group({}),
		verification: this._fb.group({}),
	});
}
