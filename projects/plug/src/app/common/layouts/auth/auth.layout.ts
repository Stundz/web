import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { UserStore } from "../../stores/user";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";

@Component({
	selector: "app-auth",
	imports: [
		RouterLink,
		RouterOutlet,
		MatRippleModule,
		MatMenuModule,
		MatToolbarModule,
		MatSidenavModule,
	],
	templateUrl: "./auth.layout.ng.html",
	styleUrl: "./auth.layout.scss",
})
export class AuthLayout {
	protected readonly userStore = inject(UserStore);

	constructor() {
		this.userStore.getUser().subscribe();
	}

	ngOnInit() {}
}
