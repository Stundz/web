import { Component, effect, Injector, inject, input } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import type { User } from "shared/models";

@Component({
  selector: "plug-app-layout",
  imports: [RouterOutlet],
  templateUrl: "./app.layout.ng.html",
  styleUrl: "./app.layout.scss",
})
export class AppLayout {
  user = input.required<User>();
  #injector = inject(Injector);

  #userEffect = effect(async () => {
    if (
      this.user() &&
      !this.user().plug &&
      !this.user()
        .roles?.map((r) => r.name)
        .includes("super-admin")
    ) {
      const [{ MatDialog }, { SignupForm }] = await Promise.all([
        import("@angular/material/dialog"),
        import("../component/signup-form/signup-form"),
      ]);

      const dialog = this.#injector.get(MatDialog);
      dialog
        .open(SignupForm, {
          disableClose: true,
        })
        .afterClosed();
    }
  });
}
