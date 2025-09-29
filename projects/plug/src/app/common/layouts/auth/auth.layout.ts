import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";

@Component({
	selector: "app-auth",
	imports: [
		RouterLink,
		RouterLinkActive,
		RouterOutlet,
		MatRippleModule,
		MatMenuModule,
	],
	templateUrl: "./auth.layout.ng.html",
	styleUrl: "./auth.layout.scss",
})
export class AuthLayout {}
