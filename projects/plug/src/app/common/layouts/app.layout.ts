import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RouterOutlet } from "@angular/router";
import type { User } from "shared/models";

import { SignupForm } from "../component/signup-form/signup-form";

@Component({
  selector: "plug-app-layout",
  imports: [RouterOutlet],
  templateUrl: "./app.layout.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./app.layout.scss",
})
export class AppLayout {
  user = input.required<User>();

  readonly dialog = inject(MatDialog);

  #userEffect = effect(() => {
    if (this.user() && !this.user()?.plug) {
      this.dialog
        .open(SignupForm, {
          disableClose: true,
        })
        .afterClosed();
    }
  });
}
