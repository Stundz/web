import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { map } from "rxjs";
import type { Model } from "../../../../dist/shared/types/shared";

@Component({
	selector: "premifly-root",
	imports: [RouterOutlet],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("premifly");
	user = toSignal(
		inject(ActivatedRoute).data.pipe(
			map((data) => (data["user"] as Model.User) || null),
		),
		{
			initialValue: null,
		},
	);
}
