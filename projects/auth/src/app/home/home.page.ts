import type { User } from "shared/models";
import { Component, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { ENVIRONMENT } from "shared";

@Component({
	selector: "auth-home",
	imports: [MatButtonModule, RouterLink],
	templateUrl: "./home.page.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./home.page.scss",
})
export class HomePage {
	user = input.required<User | undefined>();
	environment = inject(ENVIRONMENT);
}
