import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";

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
	private _fb = inject(FormBuilder);

	form = this._fb.group({});
}
