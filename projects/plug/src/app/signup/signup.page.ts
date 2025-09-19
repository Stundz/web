import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-signup",
	imports: [RouterLink, MatButtonModule],
	templateUrl: "./signup.page.ng.html",
	styleUrl: "./signup.page.scss",
})
export class SignupPage {}
