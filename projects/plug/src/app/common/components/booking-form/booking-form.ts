import { CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@Component({
	selector: "plug-booking-form",
	imports: [MatButtonModule, MatInputModule, ReactiveFormsModule, CurrencyPipe],
	templateUrl: "./booking-form.ng.html",
	styleUrl: "./booking-form.scss",
})
export class BookingForm {
	#fb = inject(FormBuilder);

	form = this.#fb.group({
		phone: this.#fb.control("", {
			nonNullable: true,
			validators: [Validators.required],
		}),
	});
}
