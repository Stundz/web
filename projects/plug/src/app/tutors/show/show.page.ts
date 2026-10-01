import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterLink } from "@angular/router";
import type { Model } from "shared";

@Component({
  selector: "plug-show",
  imports: [MatTabsModule, MatButtonModule, RouterLink],
  templateUrl: "./show.page.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./show.page.scss",
})
export class ShowPage {
  tutor = input.required<Model.Plug.Tutor>();
}
