import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { UserStore } from "../../stores/user";

@Component({
	selector: "app-auth",
	imports: [RouterLink, RouterOutlet, MatRippleModule, MatMenuModule],
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
