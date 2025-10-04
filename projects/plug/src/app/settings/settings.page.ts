import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
	selector: "app-settings",
	imports: [MatTabsModule, MatButtonModule],
	templateUrl: "./settings.page.ng.html",
	styleUrl: "./settings.page.scss",
})
export class SettingsPage {}
