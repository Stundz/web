import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-login",
	imports: [RouterLink, MatButtonModule],
	templateUrl: "./login.page.ng.html",
	styleUrl: "./login.page.scss",
})
export class LoginPage {}
