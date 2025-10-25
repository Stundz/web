import { Component, input } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatBadgeModule } from "@angular/material/badge";
import { Model } from "shared";

@Component({
	selector: "plug-auth-layout",
	imports: [
		RouterLink,
		RouterOutlet,
		MatRippleModule,
		MatMenuModule,
		MatToolbarModule,
		MatSidenavModule,
		MatBadgeModule,
	],
	templateUrl: "./auth.layout.ng.html",
	styleUrl: "./auth.layout.scss",
})
export class AuthLayout {
	user = input.required<Model.User | undefined>();
}
