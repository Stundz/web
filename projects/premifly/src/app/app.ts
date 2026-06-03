import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { map } from "rxjs";
import type { Model } from "../../../../dist/shared/types/shared";

@Component({
  selector: "premifly-root",
  imports: [RouterOutlet, RouterLink, MatButtonModule, RouterLinkActive],
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
