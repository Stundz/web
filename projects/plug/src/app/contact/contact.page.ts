import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
	selector: "plug-contact",
	imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
	templateUrl: "./contact.page.ng.html",
	styleUrl: "./contact.page.scss",
})
export class ContactPage {}
