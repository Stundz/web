import { Component } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
	selector: "app-settings",
	imports: [MatTabsModule],
	templateUrl: "./settings.page.ng.html",
	styleUrl: "./settings.page.scss",
})
export class SettingsPage {}
