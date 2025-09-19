import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
	selector: "app-guest",
	imports: [RouterLink, RouterOutlet, MatButtonModule],
	templateUrl: "./guest.layout.ng.html",
	styleUrl: "./guest.layout.scss",
})
export class GuestLayout {}
