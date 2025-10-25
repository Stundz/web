import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { Dropzone, Model, User } from "shared";
import { DatePipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";

@Component({
	selector: "app-settings",
	imports: [
		MatTabsModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		Dropzone,
		DatePipe,
		ReactiveFormsModule,
	],
	templateUrl: "./settings.page.ng.html",
	styleUrl: "./settings.page.scss",
})
export class SettingsPage {
	private _userService = inject(User);
	private _route = inject(ActivatedRoute);
	private _fb = inject(FormBuilder);
	protected user = toSignal(
		this._route.data.pipe(map((data) => data["user"] as Model.User)),
	);

	form = this._fb.group({
		bio: this._fb.group({}),
		info: this._fb.group({
			email: this._fb.control<string>(this.user()?.email || ""),
			phone: this._fb.control<string>(""),
		}),
	});
}
