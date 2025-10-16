import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { Dropzone } from "shared";

@Component({
	selector: "app-settings",
	imports: [
		MatTabsModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		Dropzone,
	],
	templateUrl: "./settings.page.ng.html",
	styleUrl: "./settings.page.scss",
})
export class SettingsPage {}
