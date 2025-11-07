import { Component, inject, input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RouterOutlet } from "@angular/router";
import { Model } from "shared";
import { SignupForm } from "../component/signup-form/signup-form";

@Component({
	selector: "plug-app-layout",
	imports: [RouterOutlet],
	templateUrl: "./app.layout.ng.html",
	styleUrl: "./app.layout.scss",
})
export class AppLayout {
	user = input.required<Model.User>();

	readonly dialog = inject(MatDialog);

	ngOnInit() {
		if (this.user() && !this.user()?.plug) {
			this.openDialog();
		}
	}

	openDialog() {
		this.dialog
			.open(SignupForm, {
				disableClose: true,
			})
			.afterClosed();
	}
}
